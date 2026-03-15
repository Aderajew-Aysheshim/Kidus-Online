import os
import django
import sys

# Add the project directory to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store.settings')
django.setup()

from products.models import Product, Category

def seed():
    # Create Categories
    begena_cat, _ = Category.objects.get_or_create(
        name='Begena',
        slug='begena',
        defaults={'name_amharic': 'በገና', 'description': 'Ancient Ethiopian Harp'}
    )
    kirar_cat, _ = Category.objects.get_or_create(
        name='Kirar',
        slug='kirar',
        defaults={'name_amharic': 'ክራር', 'description': 'Traditional Ethiopian Lyre'}
    )

    # Create Products
    products = [
        {
            'name': 'Traditional Kirar',
            'name_amharic': 'ክራር',
            'slug': 'traditional-kirar',
            'category': kirar_cat,
            'instrument_type': 'kirar',
            'service_type': 'sell',
            'description': 'Hand-crafted 6-string traditional Kirar with authentic sound resonator.',
            'price': 80.00,
            'price_currency': 'USD',
            'stock': 10,
            'is_available': True,
            'is_featured': True,
        },
        {
            'name': 'Grand Begena',
            'name_amharic': 'በገና',
            'slug': 'grand-begena',
            'category': begena_cat,
            'instrument_type': 'begena',
            'service_type': 'sell',
            'description': 'Magnificent 10-string Begena, the harp of David. Rich, deep spiritual sound.',
            'price': 130.00,
            'price_currency': 'USD',
            'stock': 5,
            'is_available': True,
            'is_featured': True,
        }
    ]

    for p_data in products:
        Product.objects.update_or_create(slug=p_data['slug'], defaults=p_data)

    print("Successfully seeded products!")

if __name__ == '__main__':
    seed()
