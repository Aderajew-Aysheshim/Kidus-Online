# users/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'password', 'password_confirm', 'phone_number',
            'whatsapp_number', 'telegram_username', 'country',
            'city', 'address', 'is_diaspora'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for viewing/updating user"""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'whatsapp_number',
            'telegram_username', 'country', 'city', 'address',
            'profile_image', 'is_diaspora', 'date_joined'
        ]
        read_only_fields = ['id', 'role', 'date_joined']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for profile update"""

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number',
            'whatsapp_number', 'telegram_username', 'country',
            'city', 'address', 'profile_image', 'is_diaspora'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value