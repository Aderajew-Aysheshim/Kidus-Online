'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import Footer from '@/components/footer';

const PRODUCTS: Record<string, { name: string; image: string }> = {

  kirar: {
    name: 'Kirar',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kirar%20for%20sell%20side%20view-Pos4gWLLWBdoyFVz4Y8FUWaqUMftCz.jpg'
  },
  begena: {
    name: 'Begena',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-30-33-VgTMnwgJOKyslW09J7WxOdpG9TsQH4.jpg'
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, addOrder } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'telebirr',
    referenceNumber: ''
  });
const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.referenceNumber) newErrors.referenceNumber = 'Transaction reference number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) handleSubmitOrder();
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    setApiError('');

    const orderPayload = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
      })),
      subtotal,
      tax,
      shipping,
      total,
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: `${formData.address}, ${formData.city}${formData.zipCode ? ' ' + formData.zipCode : ''}, ${formData.country}`,
      payment_method: formData.paymentMethod,
      payment_reference: formData.referenceNumber,
    };

    try {
      const { createOrder } = await import('@/lib/api');
      const response = await createOrder(orderPayload);

      // Sync the confirmed order back to local context
      addOrder({
        id: response.data.id || response.data.orderId || Date.now().toString(),
        date: response.data.date || new Date().toISOString(),
        status: response.data.status || 'confirmed',
        items: orderPayload.items,
        subtotal,
        tax,
        shipping,
        total,
        customerName: orderPayload.customer_name,
        customerEmail: orderPayload.customer_email,
        customerPhone: orderPayload.customer_phone,
        customerAddress: orderPayload.customer_address,
        paymentMethod: orderPayload.payment_method,
        paymentReference: orderPayload.payment_reference,
      });

      clearCart();
      router.push('/confirmation');
    } catch (error) {
      console.error('Order submission failed:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setApiError('Cannot connect to the server. Make sure Django is running on port 8000.');
      } else if (error.response?.data) {
        const detail = error.response.data.detail || JSON.stringify(error.response.data);
        setApiError(`Server error: ${detail}`);
      } else {
        setApiError('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
                <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
              </Link>
            </div>
          </div>
        </nav>
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4">
            <Card className="p-12 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
              <Link href="/cart">
                <Button className="bg-primary hover:bg-primary/90">Return to Cart</Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
              <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="outline">Back to Home</Button></Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Checkout */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">

          {/* API Error Banner */}
          {apiError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/40 rounded-lg flex items-start gap-3">
              <span className="text-destructive text-lg leading-none mt-0.5">⚠</span>
              <div>
                <p className="text-destructive font-semibold text-sm">Order Failed</p>
                <p className="text-destructive/80 text-xs mt-1">{apiError}</p>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            <div className={`flex items-center flex-1 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>1</div>
              <div className="flex-1 ml-4">
                <p className="font-semibold">Shipping</p>
                <p className="text-sm">Address &amp; Contact</p>
              </div>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`}></div>
            <div className={`flex items-center flex-1 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>2</div>
              <div className="flex-1 ml-4">
                <p className="font-semibold">Payment</p>
                <p className="text-sm">Transfer Reference</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                {step === 1 ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Ayshe" />
                        {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Ade" />
                        {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="john@example.com" />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="+1234567890" />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="123 Main St" />
                      {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Addis Ababa" />
                        {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
                        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="10001" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Ethiopia" />
                      {errors.country && <p className="text-destructive text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Payment Information</h2>

                    <div className="bg-secondary/50 p-6 rounded-lg mb-6 border border-border">
                      <p className="font-semibold text-foreground mb-4">Please transfer the total amount to one of our accounts:</p>

                      <div className="space-y-4">
                        <div className="p-4 bg-background rounded-md border border-primary/20">
                          <p className="font-bold text-primary">Telebirr Configuration</p>
                          <p className="text-foreground font-mono text-lg tracking-wider">0911 23 45 67</p>
                          <p className="text-sm text-muted-foreground">Name: Kidus Online Store</p>
                        </div>

                        <div className="p-4 bg-background rounded-md border border-primary/20">
                          <p className="font-bold text-primary">CBE Birr (Commercial Bank)</p>
                          <p className="text-foreground font-mono text-lg tracking-wider">1000 1234 56789</p>
                          <p className="text-sm text-muted-foreground">Name: Kidus Online Store</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Payment Method Used</label>
                      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option value="telebirr">Telebirr</option>
                        <option value="cbe">CBE Birr</option>
                        <option value="bank_transfer">Other Bank Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Transaction Reference Number</label>
                      <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. FT210..." />
                      {errors.referenceNumber && <p className="text-destructive text-sm mt-1">{errors.referenceNumber}</p>}
                    </div>

                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {step === 2 && (
                    <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10" onClick={() => setStep(1)} disabled={loading}>
                      Back
                    </Button>
                  )}
                  <Button className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60" onClick={handleNextStep} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Placing Order…
                      </span>
                    ) : step === 1 ? 'Continue to Payment' : 'Place Order'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-20">
                <h3 className="text-xl font-serif font-bold text-foreground mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const productData = PRODUCTS[item.id];
                    return (
                      <div key={item.cartItemId} className="border border-border rounded-lg p-3">
                        {productData?.image && (
                          <div className="relative w-full h-24 mb-3">
                            <Image src={productData.image} alt={item.name} fill className="object-cover rounded-md" />
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-foreground text-sm">{item.name}</p>
                            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-foreground font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border pt-6 mb-6 space-y-4">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                </div>
                <div className="border-t border-border pt-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>

  );
}
