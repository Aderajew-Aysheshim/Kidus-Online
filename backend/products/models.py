# products/models.py

from django.db import models


class Category(models.Model):
    """Categories: በገና, ክራር, መሰንቆ, ከበሮ, ነጠላ"""

    name = models.CharField(max_length=100)
    name_amharic = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.name_amharic})"


class Product(models.Model):
    """Musical instrument product"""

    INSTRUMENT_CHOICES = [
        ('begena', 'በገና (Begena)'),
        ('kirar', 'ክራር (Kirar)'),
        ('masenqo', 'መሰንቆ (Masenqo)'),
        ('kebero', 'ከበሮ (Kebero)'),
        ('netela', 'ነጠላ (Netela)'),
        ('other', 'Other'),
    ]

    SERVICE_CHOICES = [
        ('sell', 'For Sale - ለሽያጭ'),
        ('teach', 'For Teaching - ለስልጠና'),
        ('both', 'Both - ሁለቱም'),
    ]

    name = models.CharField(max_length=200)
    name_amharic = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products'
    )
    instrument_type = models.CharField(
        max_length=20, choices=INSTRUMENT_CHOICES
    )
    service_type = models.CharField(
        max_length=10, choices=SERVICE_CHOICES, default='sell'
    )
    description = models.TextField()
    description_amharic = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_currency = models.CharField(max_length=3, default='ETB')  # ETB, USD, EUR
    discount_percentage = models.PositiveIntegerField(default=0)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/')
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # Shipping info
    delivery_days_min = models.PositiveIntegerField(default=5)
    delivery_days_max = models.PositiveIntegerField(default=10)
    ships_internationally = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def discounted_price(self):
        if self.discount_percentage > 0:
            discount = self.price * self.discount_percentage / 100
            return self.price - discount
        return self.price


class ProductImage(models.Model):
    """Multiple images for a product"""
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images'
    )
    image = models.ImageField(upload_to='products/gallery/')
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.name}"