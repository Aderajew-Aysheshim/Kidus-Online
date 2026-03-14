# users/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow users to edit only their own profile"""
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User management

    Endpoints:
        GET    /api/users/           - List all users (admin only)
        POST   /api/users/           - Create/Register new user
        GET    /api/users/{id}/      - Get user detail
        PUT    /api/users/{id}/      - Update user
        DELETE /api/users/{id}/      - Delete user
        GET    /api/users/me/        - Get current user profile
        PUT    /api/users/me/        - Update current user profile
        POST   /api/users/register/  - Register new user
        POST   /api/users/change_password/ - Change password
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create' or self.action == 'register':
            return [permissions.AllowAny()]
        elif self.action == 'list':
            return [permissions.IsAdminUser()]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'register':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update', 'update_profile']:
            return UserProfileUpdateSerializer
        elif self.action == 'change_password':
            return ChangePasswordSerializer
        return UserSerializer

    @action(detail=False, methods=['get', 'put', 'patch'],
            permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get or update current user's profile"""
        user = request.user

        if request.method == 'GET':
            serializer = UserSerializer(user)
            return Response(serializer.data)

        serializer = UserProfileUpdateSerializer(
            user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(user).data)

    @action(detail=False, methods=['post'],
            permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "User registered successfully! ✅",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'],
            permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        """Change user password"""
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({"message": "Password changed successfully! ✅"})