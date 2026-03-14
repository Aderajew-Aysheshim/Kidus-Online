# shipping/views.py

from rest_framework import viewsets, permissions
from .models import ShippingZone, ShippingCountry
from .serializers import ShippingZoneSerializer, ShippingCountrySerializer


class ShippingZoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShippingZone.objects.filter(is_active=True)
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.AllowAny]


class ShippingCountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShippingCountry.objects.filter(is_active=True)
    serializer_class = ShippingCountrySerializer
    permission_classes = [permissions.AllowAny]