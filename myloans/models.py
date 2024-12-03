from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.validators import RegexValidator
from django.utils import timezone

# Create your models here.

class CustomUser(AbstractUser):
    national_id = models.CharField(max_length=9, unique=True, blank=False, null=False,
                                   validators=[RegexValidator(r'^\d{9}$', 'National ID must be 9 digits long.')])
    def __str__(self):
        return f"{self.username} (National ID: {self.national_id})"
    
class Customer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE) #national ID
    customer_id = models.CharField(max_length=9, unique=True, primary_key=True)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    firstName = models.CharField(max_length=100, blank=True)
    lastName = models.CharField(max_length=100, blank=True)
    middleName = models.CharField(max_length=100, blank=True)
    isEmployed = models.BooleanField(default=False)
    income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    guarantor = models.CharField(max_length=20, null=True,)

    def __str__(self):
        return f"Customer {self.firstName} (National ID: {self.customer_id}) "
    def calculate_loan_limit(self):
        if self.isEmployed and self.income:
            return self.income * Decimal('0.10')  # 10% of salary
        return Decimal('0.00')


class Loan(models.Model):
    loan_id = models.AutoField(primary_key=True)#customerid
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE,default=None,null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=15.00)
    status_loan = models.CharField(max_length=20,default="pending")
    purpose = models.CharField(max_length=20)
    date_issued = models.DateField()
    total_repayment = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def calculate_total_repayment(self):
        return self.amount + (self.amount * (self.interest_rate / 100))

    def save(self, *args, **kwargs):
        # Automatically calculate total repayment before saving
        if not self.total_repayment:
            self.total_repayment = self.calculate_total_repayment()
        super().save(*args, **kwargs)

    def mark_as_paid(self):
         self.status_loan = 'completed'
         self.save()

    def mark_as_defaulted(self):
        self.status_loan = 'defaulted'
        self.save()

    def is_overdue(self):
        return timezone.now() > self.due_date
    
    




    def __str__(self):
        return f"Loan {self.loan_id} for {self.amount} issued on {self.date_issued}"

class Profile(models.Model):
    Choices =(
        ('customer' , 'Customer'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=10, choices=Choices, default='customer')

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    


class Payment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20,
                               choices=[('completed', 'Completed'), 
                                        ('pending', 'Pending'),
                                          ('failed', 'Failed')],)
    
    def process_payment(self):
        if self.amount >= self.loan.amount:
            self.status = 'completed'
            self.loan.mark_as_paid()
        else:
            self.status = 'pending'
        self.save()

    def __str__(self):
        return f"Payment of {self.amount} for Loan ID {self.loan.loan_id}"
    
    
    


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    read = models.BooleanField(default=False)
    date_sent = models.DateTimeField(auto_now_add=True)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"

@receiver(post_save, sender=CustomUser)
def create_customer_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'customer'):
        Customer.objects.create(
            user=instance,
            customer_id=instance.national_id,  # Use national ID as the customer ID
            contact="",
            address=""
        )

    