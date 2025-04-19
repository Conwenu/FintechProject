# Generated by Django 5.1.7 on 2025-04-17 18:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_clerk_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='currency',
            field=models.CharField(default='USD', max_length=255),
        ),
        migrations.AddField(
            model_name='transaction',
            name='location',
            field=models.CharField(default='USA', max_length=255),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('monthly_budget', models.DecimalField(decimal_places=2, max_digits=10)),
                ('color', models.CharField(max_length=7)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='transaction',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.category'),
        ),
    ]
