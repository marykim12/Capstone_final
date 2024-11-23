from django.contrib.auth.models import User
from .models import  *
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# User serializer for registration
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "national_id"]
        extra_kwargs = {"password": {"write_only": True}}
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            national_id=validated_data['national_id']
        )
        return user
# Custom JWT serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        # Assuming user has a 'profile' with a 'role' field
        if hasattr(user, 'profile') and hasattr(user.profile, 'role'):
            token['role'] = user.profile.role
        return token
    

class CustomerSerializer(serializers.ModelSerializer):
    loan_limit = serializers.SerializerMethodField()
    national_id = serializers.CharField(source="user.national_id", read_only=True)
    class Meta:
        model = Customer
        fields = [
            "national_id",
            "customer_id",
            "contact",
            "address",
            "firstName",
            "lastName",
            "middleName",
            "isEmployed",
            "income",
            "loan_limit",
            "guarantor",
        ]
    def get_loan_limit(self,obj):
        return obj.calculate_loan_limit()
    def validate_customer_id(self, value):
        if not value.isdigit() or len(value) != 9:
            raise serializers.ValidationError("Customer ID must be exactly 9 digits.")
        return value

class LoanSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = Loan
        fields = ['loan_id', 'amount', 'interest_rate', 'status_loan', 'purpose', 'date_issued', 'total_repayment']

  



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model= Payment
        fields = '__all__'




class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

