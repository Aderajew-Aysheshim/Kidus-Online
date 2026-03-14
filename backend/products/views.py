# products/views.py

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    GET  /api/categories/       - List all categories
    GET  /api/categories/{id}/  - Category detail
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET  /api/products/              - List all products
    GET  /api/products/{slug}/       - Product detail
    GET  /api/products/?instrument_type=begena  - Filter by type
    GET  /api/products/?search=ክራር  - Search products
    GET  /api/products/?category__slug=begena   - Filter by category
    """
    queryset = Product.objects.filter(is_available=True)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['instrument_type', 'service_type', 'category__slug',
                        'is_featured', 'ships_internationally']
    search_fields = ['name', 'name_amharic', 'description', 'description_amharic']
    ordering_fields = ['price', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]