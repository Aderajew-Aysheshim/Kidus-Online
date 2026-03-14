# shipping/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShippingZoneViewSet, ShippingCountryViewSet

router = DefaultRouter()
router.register(r'shipping-zones', ShippingZoneViewSet)
router.register(r'shipping-countries', ShippingCountryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]