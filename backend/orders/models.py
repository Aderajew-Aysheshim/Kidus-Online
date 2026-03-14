# orders/models.py

from django.db import models
from django.conf import settings


class Order(models.Model):
    """Order for musical instruments"""

    STATUS_CHOICES = [
        ('pending',    'Pending - በመጠባበቅ ላይ'),
        ('confirmed',  'Confirmed - ተረጋግጧል'),
        ('processing', 'Processing - በሂደት ላይ'),
        ('shipped',    'Shipped - ተልኳል'),
        ('delivered',  'Delivered - ደርሷል'),
        ('cancelled',  'Cancelled - ተሰርዟል'),
    ]

    PAYMENT_CHOICES = [
        ('telebirr',      'TeleBirr'),
        ('cbe',           'CBE Birr'),
        ('bank_transfer', 'Bank Transfer'),
        ('western_union', 'Western Union'),
        ('paypal',        'PayPal'),
        ('cash',          'Cash on Delivery'),
        ('credit_card',   'Credit Card'),
    ]

    CONTACT_METHOD_CHOICES = [
        ('phone',    'Phone - ስልክ'),
        ('whatsapp', 'WhatsApp'),
        ('telegram', 'Telegram'),
        ('email',    'Email'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='orders', null=True, blank=True
    )
    # Guest order info (used when no account)
    guest_name    = models.CharField(max_length=200, blank=True)
    guest_phone   = models.CharField(max_length=20,  blank=True)
    guest_email   = models.EmailField(blank=True)

    order_number = models.CharField(max_length=20, unique=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')

    # Shipping
    shipping_country = models.ForeignKey(
        'shipping.ShippingCountry', on_delete=models.SET_NULL, null=True, blank=True
    )
    shipping_address = models.TextField(blank=True)
    shipping_city    = models.CharField(max_length=100, blank=True)

    # Contact preference
    preferred_contact = models.CharField(max_length=20, choices=CONTACT_METHOD_CHOICES, default='email')
    contact_number    = models.CharField(max_length=20, blank=True)

    # Payment
    payment_method    = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='telebirr')
    payment_reference = models.CharField(max_length=100, blank=True)
    is_paid           = models.BooleanField(default=False)

    is_teaching_order = models.BooleanField(default=False)
    is_group_discount = models.BooleanField(default=False)

    subtotal        = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax             = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost   = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total           = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    notes      = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"ETM-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Individual item within an order (stored as raw data, no product FK required)"""

    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    # We store item data directly so guest orders don't need products in DB
    item_id  = models.CharField(max_length=100, blank=True)  # 'kirar' / 'begena'
    name     = models.CharField(max_length=200)
    price    = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total    = models.DecimalField(max_digits=10, decimal_places=2)
    item_type = models.CharField(max_length=50, blank=True)  # 'Instrument'

    def save(self, *args, **kwargs):
        self.total = self.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.name}"


class ContactMessage(models.Model):
    """Contact form submissions from the website"""

    SUBJECT_CHOICES = [
        ('general',  'General Inquiry'),
        ('order',    'Order Question'),
        ('class',    'Class Question'),
        ('feedback', 'Feedback'),
        ('other',    'Other'),
    ]

    name    = models.CharField(max_length=200)
    email   = models.EmailField()
    phone   = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default='general')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email}) - {self.subject}"


class Enrollment(models.Model):
    """Student course enrollment"""

    STATUS_CHOICES = [
        ('pending', 'Pending - በመጠባበቅ ላይ'),
        ('active', 'Active - ንቁ'),
        ('completed', 'Completed - ተጠናቋል'),
        ('cancelled', 'Cancelled - ተሰርዟል'),
    ]

    course        = models.CharField(max_length=50) # begena, kirar
    course_name   = models.CharField(max_length=100)
    course_price  = models.DecimalField(max_digits=10, decimal_places=2)
    schedule      = models.CharField(max_length=100)
    
    student_name  = models.CharField(max_length=200)
    student_email = models.EmailField()
    student_phone = models.CharField(max_length=30)
    
    experience    = models.CharField(max_length=50)
    instrument    = models.CharField(max_length=50)
    
    payment_method    = models.CharField(max_length=50, default='telebirr')
    payment_reference = models.CharField(max_length=100, blank=True)
    is_paid           = models.BooleanField(default=False)
    
    start_date    = models.DateTimeField(null=True, blank=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    enroll_date   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-enroll_date']

    def __str__(self):
        return f"{self.student_name} - {self.course_name}"