# orders/serializers.py

from rest_framework import serializers
from .models import Order, OrderItem, ContactMessage, Enrollment


# ── Read serializer (for GET responses) ─────────────────────
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'item_id', 'name', 'price', 'quantity', 'total', 'item_type']
        read_only_fields = ['total']


class OrderSerializer(serializers.ModelSerializer):
    items          = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    date           = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'guest_name', 'guest_email', 'guest_phone',
            'shipping_address', 'shipping_city',
            'payment_method', 'payment_reference', 'is_paid',
            'subtotal', 'tax', 'shipping_cost', 'total',
            'items', 'date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['order_number', 'date', 'created_at', 'updated_at']


# ── Write serializer (for POST from Next.js frontend) ───────
class FrontendOrderItemSerializer(serializers.Serializer):
    """Matches the item shape sent from the Next.js cart"""
    id       = serializers.CharField()
    name     = serializers.CharField()
    price    = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1)
    type     = serializers.CharField(required=False, default='Instrument')


class FrontendCreateOrderSerializer(serializers.Serializer):
    """Accepts the exact payload shape the Next.js checkout page sends"""
    items            = FrontendOrderItemSerializer(many=True)
    subtotal         = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax              = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    shipping         = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    total            = serializers.DecimalField(max_digits=10, decimal_places=2)
    customer_name    = serializers.CharField(max_length=200)
    customer_email   = serializers.EmailField()
    customer_phone   = serializers.CharField(max_length=30, required=False, default='')
    customer_address  = serializers.CharField(required=False, default='')
    payment_method    = serializers.CharField(required=False, default='telebirr')
    payment_reference = serializers.CharField(max_length=100, required=False, default='')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order.objects.create(
            user             = user if user.is_authenticated else None,
            guest_name       = validated_data['customer_name'],
            guest_email      = validated_data['customer_email'],
            guest_phone      = validated_data.get('customer_phone', ''),
            shipping_address  = validated_data.get('customer_address', ''),
            payment_method    = validated_data.get('payment_method', 'telebirr'),
            payment_reference = validated_data.get('payment_reference', ''),
            subtotal          = validated_data['subtotal'],
            tax              = validated_data.get('tax', 0),
            shipping_cost    = validated_data.get('shipping', 0),
            total            = validated_data['total'],
            status           = 'confirmed',
        )

        for item in items_data:
            OrderItem.objects.create(
                order     = order,
                item_id   = item['id'],
                name      = item['name'],
                price     = item['price'],
                quantity  = item['quantity'],
                item_type = item.get('type', 'Instrument'),
            )

        return order

    def to_representation(self, instance):
        return OrderSerializer(instance).data


# ── Contact Message Serializer ───────────────────────────────
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ['id', 'enroll_date']