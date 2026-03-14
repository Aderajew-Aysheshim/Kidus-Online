# orders/admin.py

from django.contrib import admin
from .models import Order, OrderItem, ContactMessage, Enrollment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ['order_number', 'guest_name', 'guest_email', 'status', 'total', 'is_paid', 'created_at']
    list_filter   = ['status', 'is_paid', 'payment_method']
    search_fields = ['order_number', 'guest_name', 'guest_email', 'guest_phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter   = ['subject', 'is_read']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']
    list_editable = ['is_read']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display  = ['student_name', 'course_name', 'status', 'is_paid', 'enroll_date']
    list_filter   = ['status', 'is_paid', 'course']
    search_fields = ['student_name', 'student_email', 'payment_reference']