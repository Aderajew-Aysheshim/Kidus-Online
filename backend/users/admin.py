# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for CustomUser"""

    model = CustomUser

    list_display = (
        "username",
        "email",
        "role",
        "phone_number",
        "country",
        "city",
        "is_diaspora",
        "is_staff",
    )

    list_filter = (
        "role",
        "country",
        "city",
        "is_diaspora",
        "is_staff",
        "is_superuser",
    )

    search_fields = ("username", "email", "phone_number", "telegram_username")
    ordering = ("username",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Info",
            {
                "fields": (
                    "role",
                    "phone_number",
                    "whatsapp_number",
                    "telegram_username",
                    "country",
                    "city",
                    "address",
                    "profile_image",
                    "is_diaspora",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Additional Info",
            {
                "fields": (
                    "role",
                    "phone_number",
                    "whatsapp_number",
                    "telegram_username",
                    "country",
                    "city",
                    "address",
                    "profile_image",
                    "is_diaspora",
                )
            },
        ),
    )