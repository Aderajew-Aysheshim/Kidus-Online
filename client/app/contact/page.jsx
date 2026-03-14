'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const { sendContactMessage } = await import('@/lib/api');
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      console.error('Contact form failed:', error);
      if (error.code === 'ERR_NETWORK' || !error.response) {
        setApiError('Cannot reach the server. Make sure Django is running on port 8000.');
      } else if (error.response?.data) {
        const detail = error.response.data.detail || JSON.stringify(error.response.data);
        setApiError(`Server error: ${detail}`);
      } else {
        setApiError('Failed to send message. Please try again or reach us directly via Telegram.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          </div>
        </div>
      </nav>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4 text-balance">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-12">Have questions about our instruments or classes? We&apos;d love to hear from you!</p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-8">
                {/* Success Banner */}
                {submitted && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary rounded-lg">
                    <p className="text-primary font-semibold">✓ Message sent successfully!</p>
                    <p className="text-sm text-muted-foreground">We&apos;ll respond within 24 hours.</p>
                  </div>
                )}

                {/* Error Banner */}
                {apiError && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/40 rounded-lg flex items-start gap-3">
                    <span className="text-destructive text-lg leading-none mt-0.5">⚠</span>
                    <div>
                      <p className="text-destructive font-semibold text-sm">Send Failed</p>
                      <p className="text-destructive/80 text-xs mt-1">{apiError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-foreground">Send us a Message</h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Your Name" />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="your@email.com" />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="+1234567890" />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="class">Class Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} rows="5" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Tell us how we can help..."></textarea>
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </span>
                    ) : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Direct Contact</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                      <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
                      <p className="text-xs text-muted-foreground mt-1">Fastest response time</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                      <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
                      <p className="text-xs text-muted-foreground mt-1">Chat or call anytime</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                      <p className="text-muted-foreground">Respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-secondary">
                <h3 className="text-lg font-serif font-bold text-foreground mb-4">Response Time</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary font-bold">24h</span> Email inquiries</li>
                  <li className="flex items-start gap-2"><span className="text-primary font-bold">1h</span> Telegram messages</li>
                  <li className="flex items-start gap-2"><span className="text-primary font-bold">2h</span> WhatsApp messages</li>
                </ul>
              </Card>

              <Card className="p-8 bg-primary/10">
                <h3 className="text-lg font-serif font-bold text-foreground mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Monday - Friday: 9 AM - 6 PM (ET)</p>
                  <p>Saturday: 10 AM - 4 PM (ET)</p>
                  <p>Sunday: Closed</p>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ */}
          <Card className="p-8 mt-12">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Common Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How long does shipping take?</h3>
                <p className="text-muted-foreground">We ship worldwide in 5-10 business days with tracking information provided.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Can I change my class schedule?</h3>
                <p className="text-muted-foreground">Yes! Contact us within 48 hours of enrollment to switch to another available schedule.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">We offer full refunds within 7 days of purchase for any reason. After 7 days, partial refunds may be available.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Are there group discounts?</h3>
                <p className="text-muted-foreground">Absolutely! Contact us for special pricing on group orders and bulk enrollment.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
