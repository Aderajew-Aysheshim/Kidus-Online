'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Footer from '@/components/footer';

import { Package, BookOpen, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { useCart, Order, Enrollment } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { getOrders, getEnrollments } from '@/lib/api';


export default function OrdersPage() {
  const { orders: localOrders, enrollments: localEnrollments } = useCart();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [serverOrders, setServerOrders] = useState<Order[] | null>(null);
  const [serverEnrollments, setServerEnrollments] = useState<Enrollment[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');


  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const orders = serverOrders ?? localOrders;
  const enrollments = serverEnrollments ?? localEnrollments;

  const hasOrders = orders && orders.length > 0;
  const hasEnrollments = enrollments && enrollments.length > 0;

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput.trim()) return;
    setFetchLoading(true);
    setFetchError('');
    setServerOrders(null);
    setServerEnrollments(null);

    try {
      const [ordersRes, enrollRes] = await Promise.all([
        getOrders(emailInput.trim()),
        getEnrollments(emailInput.trim()),
      ]);
      setServerOrders(ordersRes.data?.results ?? ordersRes.data ?? []);
      setServerEnrollments(enrollRes.data?.results ?? enrollRes.data ?? []);
      setEmail(emailInput.trim());
    } catch (err: any) {
      console.error('Fetch failed:', err);
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setFetchError('Cannot connect to the server. Make sure Django is running on port 8000. Showing local data instead.');
      } else {
        setFetchError(`Server error (${err.response?.status}). Showing local data instead.`);
      }
    } finally {
      setFetchLoading(false);
    }
  };


  const formatDate = (dateStr: string) => {

    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <main className="min-h-screen bg-background">
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">My Account</h1>

          <Card className="p-6 mb-10 border-primary/20">
            <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Look Up Your Orders
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Enter the email you used when ordering or enrolling to load your history from our server.</p>
            <form onSubmit={handleFetch} className="flex gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 disabled:opacity-60" disabled={fetchLoading}>
                {fetchLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" />Load</span>
                )}
              </Button>
            </form>
            {fetchError && (
              <p className="text-amber-600 dark:text-amber-400 text-xs mt-3 flex items-center gap-1">
                <span>⚠</span> {fetchError}
              </p>
            )}
            {email && !fetchError && (
              <p className="text-primary text-xs mt-3">
                ✓ Showing results for <strong>{email}</strong>
              </p>
            )}
          </Card>

          {!hasOrders && !hasEnrollments ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-foreground mb-4">No Activity Yet</h2>
              <p className="text-muted-foreground mb-8">
                {email ? `No orders or enrollments found for ${email}.` : 'Enter your email above or start shopping to see your history here.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/cart"><Button className="bg-primary hover:bg-primary/90">Shop Instruments</Button></Link>
                <Link href="/enroll"><Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Enroll in Class</Button></Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-12">

              {hasOrders && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Package className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif font-bold text-foreground">My Orders</h2>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">{orders.length}</span>
                  </div>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-6 hover:shadow-lg transition">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
                            <p className="font-mono font-bold text-foreground mb-4">{order.id}</p>
                            <p className="text-sm text-muted-foreground mb-2">Order Date</p>
                            <p className="text-foreground mb-4">{formatDate(order.date || order.created_at)}</p>
                            <p className="text-sm text-muted-foreground mb-2">Items</p>
                            <div className="space-y-1">
                              {(order.items || []).map((item, idx) => (
                                <p key={idx} className="text-foreground">{item.name} x {item.quantity}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Status</p>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <p className="font-semibold text-foreground capitalize">{order.status}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Total</p>
                            <p className="text-3xl font-bold text-primary mb-4">${Number(order.total || 0).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground mb-2">Shipping To</p>
                            <p className="text-foreground text-sm">{order.customerAddress || order.customer_address}</p>
                          </div>
                        </div>
                        <div className="border-t border-border mt-6 pt-6">
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            View Details <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {hasEnrollments && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-serif font-bold text-foreground">My Classes</h2>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">{enrollments.length}</span>
                  </div>
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="p-6 hover:shadow-lg transition border-primary/20">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Course</p>
                            <p className="text-2xl font-bold text-foreground mb-4">{enrollment.courseName || enrollment.course_name}</p>
                            <p className="text-sm text-muted-foreground mb-2">Schedule</p>
                            <p className="text-foreground mb-4">{enrollment.schedule}</p>
                            <p className="text-sm text-muted-foreground mb-2">Instrument</p>
                            <p className="text-foreground capitalize">{enrollment.instrument}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Status</p>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <p className="font-semibold text-foreground capitalize">{enrollment.status}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                            <p className="text-foreground font-semibold mb-4">{formatDate(enrollment.startDate || enrollment.start_date)}</p>
                            <p className="text-sm text-muted-foreground mb-2">Course Fee</p>
                            <p className="text-2xl font-bold text-primary">${enrollment.coursePrice || enrollment.course_price}</p>
                          </div>
                        </div>
                        <div className="border-t border-border mt-6 pt-6">
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Access Class <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Card className="p-8 bg-secondary mt-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">Can&apos;t find what you&apos;re looking for? Contact our support team:</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Telegram</h3>
                <a href="https://t.me/kidus626" className="text-primary hover:underline">@kidus626</a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
                <a href="https://wa.me/251954789638" className="text-primary hover:underline">+251 954 789 638</a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">Support within 24 hours</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </main>

  );
}
