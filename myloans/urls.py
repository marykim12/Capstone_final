from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

urlpatterns = [
    path('user/register/', RegisterUserView.as_view(), name='register'),
    path('api/token/', LoginView.as_view(), name = 'logIn'),
    path('customers/', CustomerListCreateView.as_view(), name='customer-list-create'),
    path('customers/profile/', customer_profile_detail, name="customer_dashboard"),
    path('customers/profile/<int:customer_id>/', customer_profile_detail, name="customer_profile_detail"),
    path('loans/', LoanListCreateView.as_view(), name='loan-list-create'),
    path('loans/<int:pk>/', LoanDetailView.as_view(), name='loan-detail'),
    path('customers/<int:pk>/loan-limit/', customer_loan_limit, name='customer-loan-limit'),
    path('admin/dashboard/', admin_dashboard, name='admin_dashboard'),
    path('payment/',StripeCheckoutView.as_view(), name='make_payment'),
    path('loans/<int:loan_id>/create-checkout-session/', StripeCheckoutView.as_view(), name='create-checkout-session'),


  
    path('',include(router.urls)),
]

#POST/api/payments/-create
#GET/api/payment/{id}/ - retrieve specific
#PUT/api/paymenet/{id}/ - update
#DELETE/api/payments/{id}/