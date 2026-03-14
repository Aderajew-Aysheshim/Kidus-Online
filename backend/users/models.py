# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Custom user for Ethiopian Music Instrument Store"""

    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),  # For online teaching (ክራር, በገና)
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    telegram_username = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_diaspora = models.BooleanField(default=False)  # ከውጭ አለም የሚኖሩ

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"