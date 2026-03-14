# products/serializers.py

from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_amharic', 'slug', 'description',
                  'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    discounted_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'name_amharic', 'slug', 'category_name',
            'instrument_type', 'service_type', 'price', 'price_currency',
            'discount_percentage', 'discounted_price', 'image',
            'is_available', 'is_featured', 'delivery_days_min',
            'delivery_days_max', 'ships_internationally'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full detail serializer"""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    discounted_price = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'name_amharic', 'slug', 'category',
            'instrument_type', 'service_type', 'description',
            'description_amharic', 'price', 'price_currency',
            'discount_percentage', 'discounted_price', 'stock',
            'image', 'images', 'is_available', 'is_featured',
            'delivery_days_min', 'delivery_days_max',
            'ships_internationally', 'created_at', 'updated_at'
        ]