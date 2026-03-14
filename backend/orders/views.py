# orders/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Order, ContactMessage, Enrollment
from .serializers import OrderSerializer, FrontendCreateOrderSerializer, ContactMessageSerializer, EnrollmentSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    POST   /api/orders/                            - Create new order (guest-friendly)
    GET    /api/orders/?email=guest@email.com      - List orders by guest email
    GET    /api/orders/{id}/                       - Order detail
    GET    /api/orders/track/?order_number=ETM-XX  - Track by order number
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        email = self.request.query_params.get('email')

        if user.is_staff:
            return Order.objects.all()
        if user.is_authenticated:
            return Order.objects.filter(user=user)
        # Guest lookup by email
        if email:
            return Order.objects.filter(guest_email__iexact=email)
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return FrontendCreateOrderSerializer
        return OrderSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def track_order(self, request):
        """Track order by order number"""
        order_number = request.query_params.get('order_number')
        if not order_number:
            return Response(
                {"error": "Please provide order_number"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            order = Order.objects.get(order_number=order_number)
            return Response(OrderSerializer(order).data)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    POST /api/contact/  - Submit a contact message
    GET  /api/contact/  - List all messages (admin only)
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        return Response(
            {"success": True, "messageId": message.id, "message": "Message received! We'll reply within 24 hours."},
            status=status.HTTP_201_CREATED
        )


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    POST   /api/enrollments/                        - Create new enrollment
    GET    /api/enrollments/?email=guest@email.com  - List enrollments by student email
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        email = self.request.query_params.get('email')

        if user.is_staff:
            return Enrollment.objects.all()
        if email:
            return Enrollment.objects.filter(student_email__iexact=email)
        return Enrollment.objects.none()