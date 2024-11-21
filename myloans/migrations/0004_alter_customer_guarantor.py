# Generated by Django 5.1.2 on 2024-11-19 17:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myloans', '0003_guarantor_alter_loan_purpose_alter_profile_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='guarantor',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='customer', to='myloans.guarantor'),
        ),
    ]
