# Generated by Django 5.1.7 on 2025-04-18 02:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_category_currency'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='transaction_date',
            field=models.DateTimeField(),
        ),
    ]
