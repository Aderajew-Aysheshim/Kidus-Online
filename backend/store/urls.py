# music_store/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to Kidus Online API",
        "status": "Running smoothly 🚀",
        "endpoints": "/api/",
        "admin": "/admin/"
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),

    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API endpoints
    path('api/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('shipping.urls')),

    # Browsable API login (for development)
    path('api-auth/', include('rest_framework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)