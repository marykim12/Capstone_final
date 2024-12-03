from django.contrib import admin
from .models import Customer, Loan, Payment, CustomUser

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('customer_id', 'firstName', 'lastName', 'contact', 'address', 'isEmployed', 'income')
    search_fields = ('firstName', 'lastName', 'contact', 'customer_id')
    list_filter = ('isEmployed',)

class LoanAdmin(admin.ModelAdmin):
    list_display = ('loan_id', 'customer', 'amount', 'interest_rate', 'status_loan', 'purpose', 'date_issued', 'total_repayment')
    search_fields = ('loan_id', 'customer__firstName', 'customer__lastName', 'status_loan')
    list_filter = ('status_loan', 'date_issued')

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'loan', 'amount', 'date', 'status')
    search_fields = ('loan__loan_id',)
    list_filter = ('status', 'date')

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'national_id', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'national_id')

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(Payment, PaymentAdmin)
