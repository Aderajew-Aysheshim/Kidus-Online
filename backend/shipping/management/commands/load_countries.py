# Create a management command
# shipping/management/commands/load_countries.py

import os
from django.core.management.base import BaseCommand
from shipping.models import ShippingZone, ShippingCountry


class Command(BaseCommand):
    help = 'Load shipping countries'

    def handle(self, *args, **kwargs):
        # Create zones
        europe = ShippingZone.objects.create(
            name='Europe', zone_type='europe',
            base_shipping_cost=45.00,
            estimated_days_min=5, estimated_days_max=10
        )
        north_america = ShippingZone.objects.create(
            name='North America', zone_type='north_america',
            base_shipping_cost=55.00,
            estimated_days_min=7, estimated_days_max=14
        )
        middle_east = ShippingZone.objects.create(
            name='Middle East', zone_type='middle_east',
            base_shipping_cost=40.00,
            estimated_days_min=5, estimated_days_max=10
        )
        oceania = ShippingZone.objects.create(
            name='Oceania', zone_type='oceania',
            base_shipping_cost=60.00,
            estimated_days_min=10, estimated_days_max=15
        )

        countries = [
            # Europe
            {'zone': europe, 'name': 'United Kingdom', 'code': 'GB', 'flag_emoji': '🇬🇧'},
            {'zone': europe, 'name': 'Germany', 'code': 'DE', 'flag_emoji': '🇩🇪'},
            {'zone': europe, 'name': 'Norway', 'code': 'NO', 'flag_emoji': '🇳🇴'},
            {'zone': europe, 'name': 'Netherlands', 'code': 'NL', 'flag_emoji': '🇳🇱'},
            {'zone': europe, 'name': 'Switzerland', 'code': 'CH', 'flag_emoji': '🇨🇭'},
            {'zone': europe, 'name': 'Belgium', 'code': 'BE', 'flag_emoji': '🇧🇪'},
            {'zone': europe, 'name': 'Denmark', 'code': 'DK', 'flag_emoji': '🇩🇰'},
            {'zone': europe, 'name': 'Poland', 'code': 'PL', 'flag_emoji': '🇵🇱'},
            # North America
            {'zone': north_america, 'name': 'United States', 'code': 'US', 'flag_emoji': '🇺🇸'},
            {'zone': north_america, 'name': 'Canada', 'code': 'CA', 'flag_emoji': '🇨🇦'},
            # Middle East
            {'zone': middle_east, 'name': 'UAE (Dubai)', 'code': 'AE', 'flag_emoji': '🇦🇪'},
            {'zone': middle_east, 'name': 'Saudi Arabia', 'code': 'SA', 'flag_emoji': '🇸🇦'},
            # Oceania
            {'zone': oceania, 'name': 'Australia', 'code': 'AU', 'flag_emoji': '🇦🇺'},
        ]

        for country_data in countries:
            ShippingCountry.objects.create(**country_data)

        self.stdout.write(self.style.SUCCESS('✅ Countries loaded successfully!'))