# products/admin.py

from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_amharic', 'instrument_type',
                    'price', 'stock', 'is_available', 'is_featured']
    list_filter = ['instrument_type', 'service_type', 'is_available', 'is_featured']
    search_fields = ['name', 'name_amharic']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}