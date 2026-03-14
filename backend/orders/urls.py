# orders/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, ContactMessageViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'orders',      OrderViewSet,          basename='order')
router.register(r'contact',     ContactMessageViewSet, basename='contact')
router.register(r'enrollments', EnrollmentViewSet,     basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
]