# shipping/models.py

from django.db import models


class ShippingZone(models.Model):
    """
    Shipping destinations:
    UK, USA, Australia, Germany, Norway, Netherlands,
    Switzerland, Belgium, Canada, Dubai, Saudi Arabia,
    Denmark, Poland, etc.
    """

    ZONE_CHOICES = [
        ('domestic', 'Domestic - ሀገር ውስጥ'),
        ('east_africa', 'East Africa'),
        ('middle_east', 'Middle East'),
        ('europe', 'Europe'),
        ('north_america', 'North America'),
        ('oceania', 'Oceania'),
    ]

    name = models.CharField(max_length=100)
    zone_type = models.CharField(max_length=20, choices=ZONE_CHOICES)
    base_shipping_cost = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days_min = models.PositiveIntegerField(default=5)
    estimated_days_max = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.get_zone_type_display()})"


class ShippingCountry(models.Model):
    """Individual countries we ship to"""

    zone = models.ForeignKey(
        ShippingZone, on_delete=models.CASCADE, related_name='countries'
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)  # ISO country code
    flag_emoji = models.CharField(max_length=10, blank=True)
    additional_cost = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Shipping Countries"
        ordering = ['name']

    def __str__(self):
        return f"{self.flag_emoji} {self.name}"

    @property
    def total_shipping_cost(self):
        return self.zone.base_shipping_cost + self.additional_cost