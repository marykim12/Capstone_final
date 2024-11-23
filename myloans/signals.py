from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Loan
from django.core.mail import send_mail
from django.conf import settings


# myloans/signals.py
@receiver(post_save, sender=Loan)
def send_loan_notification(sender, instance, created, **kwargs):
    if created:
        # Send an email or perform any notification logic
        customer = instance.customer
        loan_amount = instance.amount
        loan_date = instance.date_issued
        subject = 'Your Loan Application Has Been Sent'
        message = f'Hello {customer.user.first_name},\n\nYour loan of amount ${loan_amount} has been successfully sent on {loan_date}. We will notify you once it has been processed.'
        
        # Send an email notification (you can use other notification methods too)
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [customer.user.email])
