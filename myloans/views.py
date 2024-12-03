from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
from .serializers import *
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime,timedelta
from django.conf import settings
from django.http import JsonResponse
import requests
from django.conf import settings
import base64
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return render(request,'index.html')

class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            return Response({
                "user": user_serializer.data,
                "message": "User registered successfully!"
            }, status=status.HTTP_201_CREATED)
        return Response({
            "errors" : user_serializer.errors,
            "message": "User registration failed."
        }, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_admin'] = user.is_staff  # Assuming is_staff indicates admin status
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_admin'] = self.user.is_staff  # Add to response body
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            try:
                customer = user.customer
                refresh = RefreshToken.for_user(user)

                # Include additional information (is_admin)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'customer_id': customer.customer_id,
                    'is_admin': user.is_staff,  # Add the is_admin field here
                }, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({"error": "Customer profile not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def customer_profile_detail(request):
        try:
            customer = request.user.customer
        except AttributeError:
            return Response({"error": "You must be logged in as a customer to access this profile."},
                            status=status.HTTP_403_FORBIDDEN)
        except Customer.DoesNotExist:
            return Response({"error": "Customer profile not found."},
                        status=status.HTTP_404_NOT_FOUND)
        if request.method == 'GET':
            data = {
                "customer_id": customer.customer_id,
                "contact": customer.contact,
                "address": customer.address,
                "firstName": customer.firstName,
                "lastName": customer.lastName,
                "middleName": customer.middleName,
                "isEmployed": customer.isEmployed,
                "income": customer.income,
                "loanLimit":customer.calculate_loan_limit(),
                "guarantor":customer.guarantor,
                
            }
            return Response(data, status=status.HTTP_200_OK)
        elif request.method == 'PATCH':
            serializer = CustomerSerializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# displays the customers loan


class CustomerLoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return loans associated with the authenticated customer
        return Loan.objects.filter(customer=self.request.user)



#creation of customers
class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)
        return super().perform_create(serializer)
    
    

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)



#for viewing 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_loan_limit(request, pk):
    try:
        # Get customer by primary key (customer_id)
        customer = get_object_or_404(Customer, pk=pk)
        # Ensure the customer matches the authenticated user
        if customer.user != request.user:
            return Response({"error": "Unauthorized access to customer data."}, status=status.HTTP_403_FORBIDDEN)
        # Calculate loan limit
        loan_limit = customer.calculate_loan_limit()
        return Response({"loan_limit": loan_limit}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)


class LoanListCreateView(generics.ListCreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        # Filter loans by the logged-in user
        return Loan.objects.filter(customer=self.request.user.customer)


    def perform_create(self, serializer):
        try:
            # Get the current customer
            customer = self.request.user.customer

            # Validate employment status and income
            if not customer.isEmployed or not customer.income:
                raise serializers.ValidationError({"error": "Only employed customers with valid income can apply for loans."})

            # Validate if the loan amount is within the customer's loan limit
            loan_limit = customer.calculate_loan_limit()
            if serializer.validated_data['amount'] > loan_limit:
                raise serializers.ValidationError({"error": "Requested loan exceeds your loan limit."})

            # Check if there are any existing loans that are pending or approved
            if Loan.objects.filter(customer=customer, status_loan__in=['pending', 'approved']).exists():
                raise serializers.ValidationError({"error": "You have an existing loan that must be cleared first."})

            # Save the loan object if all checks pass
            serializer.save(customer=customer)

        except serializers.ValidationError as e:
            # Log the validation error
            print(f"Validation Error: {e.detail}")
            # Reraise the validation error to propagate it to the response
            raise e


    

@api_view(['POST'])
@permission_classes([IsAdminUser])
def review_loan(request, loan_id):
    try:
        loan = Loan.objects.get(id=loan_id)
        customer = loan.customer
        # Check eligibility
        if loan.amount > customer.calculate_loan_limit():
            loan.status_loan = "declined"
            loan.save()
            return Response({"message": "Loan declined. Amount exceeds loan limit."}, status=200)
        loan.status_loan = "approved"
        loan.save()
        return Response({"message": "Loan approved successfully!"}, status=200)
    except Loan.DoesNotExist:
        return Response({"error": "Loan not found."}, status=404)


class LoanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Loan.objects.all()
    serializer_class =LoanSerializer
    permission_classes = [IsAuthenticated]

#user cannot delete,view or update alon that does not belong to them
    def get_queryset(self):
        return Loan.objects.filter(customer=self.request.user.customer)
    
    overdue_loans = Loan.objects.filter(
    date_issued__lt=timezone.now() - timedelta(days=30),
    status_loan='approved'
)



# This is your test secret API key.

def generate_mpesa_access_token():
    url = f"{settings.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=(settings.MPESA_CONSUMER_KEY, settings.MPESA_CONSUMER_SECRET))
    token = response.json().get("access_token")
    return token

def lipa_na_mpesa(phone_number, amount):
    # Generate access token
    access_token = generate_mpesa_access_token()
    
    # Prepare the request
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((settings.MPESA_SHORTCODE + settings.MPESA_PASSKEY + timestamp).encode()).decode()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "BusinessShortCode": settings.MPESA_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,  # Customer's phone number
        "PartyB": settings.MPESA_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": "Loan Payment",
        "TransactionDesc": "Payment for Loan",
    }
    url = f"{settings.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

@csrf_exempt
def mpesa_callback(request):
    if request.method == "POST":
        mpesa_response = json.loads(request.body)
        
        # Extract relevant data (e.g., payment status)
        result_code = mpesa_response['Body']['stkCallback']['ResultCode']
        result_description = mpesa_response['Body']['stkCallback']['ResultDesc']
        
        if result_code == 0:
            # Payment successful
            # Update loan payment record
            pass
        else:
            # Payment failed
            pass
        
        return JsonResponse({"status": "success"})
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mpesa_payment(request, loan_id):
    try:
        # Retrieve the loan
        loan = Loan.objects.get(id=loan_id, customer=request.user.customer)

        # Extract payment details
        phone_number = request.data.get('phone_number')
        amount = request.data.get('amount')

        if not phone_number or not amount:
            return Response({"error": "Phone number and amount are required."}, status=400)

        # Initiate M-Pesa STK Push
        mpesa_response = lipa_na_mpesa(phone_number, amount)

        # Process the response from M-Pesa
        if mpesa_response.get("ResponseCode") == "0":
            return Response({"message": "Payment request sent to your phone. Complete it to proceed."})
        else:
            return Response({"error": mpesa_response.get("ResponseDescription", "Payment initiation failed.")}, status=400)

    except Loan.DoesNotExist:
        return Response({"error": "Loan not found or not associated with the logged-in customer."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

          
@api_view(['Get'])
@permission_classes([IsAuthenticated])
def loan_and_payment_details(request):
    customer = request.user.customer
    loans = Loan.objects.filter(customer=customer)
    loan_data = LoanSerializer(loans, many=True).data

    for loan in loan_data:
        payment = Payment.object.filter(loan__loan_id=loan['loan_id'])
        loan['payments'] = PaymentSerializer(payment,many=True).data
    return Response(loan_data, status=200)  

##loans_nearing_due = Loan.objects.filter(
        #due_date__lte=timezone.now() + timedelta(days=3),
        #tatus_loan='waiting'
    #)

    #for loan in loans_nearing_due:
        ## Send notification to the customer
        #message = f"Your loan (ID: {loan.id}) is due for payment in 3 days. Please make your payment on time."
        #Notification.objects.create(user=loan.customer.user, message=message, loan=loan)




class AdminLoanListView(generics.ListAPIView):
    serializer_class = LoanSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        # all loans for admin
        return Loan.objects.all()


@api_view(['GET'])
@permission_classes([IsAdminUser])  # Only admins can access
def admin_dashboard(request):
    # Get all customers
    customers = Customer.objects.all()
    customers_data = CustomerSerializer(customers, many=True).data

    # Get all loans
    loans = Loan.objects.all()
    loans_data = LoanSerializer(loans, many=True).data

    # Get all payments
    payments = Payment.objects.all()
    payments_data = PaymentSerializer(payments, many=True).data

    #for overdue loans
    loans_data = []
    for loan in loans:
        loan_dict = LoanSerializer(loan).data
        # Calculate due date dynamically
        loan_dict['due_date'] = (loan.date_issued + timedelta(days=30)).strftime('%Y-%m-%d')
        loans_data.append(loan_dict)



    # Aggregate and return the data
    data = {
        "customers": customers_data,
        "loans": loans_data,
        "payments": payments_data,
        
    }
    return Response(data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get refresh token from request
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            # Blacklist the token
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)