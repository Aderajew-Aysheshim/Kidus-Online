# shipping/serializers.py

from rest_framework import serializers
from .models import ShippingZone, ShippingCountry


class ShippingCountrySerializer(serializers.ModelSerializer):
    total_shipping_cost = serializers.ReadOnlyField()
    zone_name = serializers.CharField(source='zone.name', read_only=True)

    class Meta:
        model = ShippingCountry
        fields = ['id', 'name', 'code', 'flag_emoji', 'zone_name',
                  'additional_cost', 'total_shipping_cost', 'is_active']


class ShippingZoneSerializer(serializers.ModelSerializer):
    countries = ShippingCountrySerializer(many=True, read_only=True)

    class Meta:
        model = ShippingZone
        fields = ['id', 'name', 'zone_type', 'base_shipping_cost',
                  'estimated_days_min', 'estimated_days_max',
                  'is_active', 'countries']