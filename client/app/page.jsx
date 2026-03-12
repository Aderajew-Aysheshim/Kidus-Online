'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, Mail, MapPin, Star, Users, ShoppingCart, ArrowRight, Moon, Sun, Globe } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const { cart, addToCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = (productId, productName, productType, price) => {
    addToCart({
      id: productId,
      name: productName,
      type: productType,
      price: price,
      quantity: 1
    });
  };

  return (
    <div className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-primary">Kidus Online</h1>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#instruments" className="text-sm hover:text-primary transition">{t.instruments}</Link>
            <Link href="#classes" className="text-sm hover:text-primary transition">{t.classes}</Link>
            <Link href="/contact" className="text-sm hover:text-primary transition">{t.contact}</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}>
              <Globe className="w-4 h-4" />
              <span className="ml-1 text-xs font-semibold">{language.toUpperCase()}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link href="/orders">
              <Button variant="ghost" size="sm">{t.myAccount}</Button>
            </Link>
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary text-sm font-semibold tracking-widest uppercase">{t.welcome}</p>
                <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight text-balance">
                  {t.heroTitle}
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="#instruments">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-background px-8">
                    {t.shopInstruments}
                  </Button>
                </Link>
                <Link href="#classes">
                  <Button size="lg" variant="outline" className="px-8">
                    {t.exploreClasses}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                <div>
                  <p className="text-primary font-bold text-2xl">1000+</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.studentsWorldwide}</p>
                </div>
                <div>
                  <p className="text-primary font-bold text-2xl">50+</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.countriesServed}</p>
                </div>
                <div>
                  <p className="text-primary font-bold text-2xl">10+</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.yearsOfExcellence}</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full h-96">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/both%20kirar%20and%20begena%20image-vD4ze1FpO7VAJyOFe4kxtgWfy51bRN.jpg"
                  alt="Kirar and Begena instruments collection"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instruments Section */}
      <section id="instruments" className="py-20 bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Our Instruments</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Handcrafted by Master Artisans</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Each instrument is crafted with traditional techniques and premium materials, ready for immediate worldwide delivery.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Kirar */}
            <Card className="bg-card border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="relative h-72 bg-secondary">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kirar%20for%20sell%20side%20view-Pos4gWLLWBdoyFVz4Y8FUWaqUMftCz.jpg"
                  alt="Kirar - 5-10 stringed Ethiopian lyre"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Kirar</h3>
                <p className="text-sm text-muted-foreground mb-1">Traditional Ethiopian Lyre</p>
                <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">5-10 stringed instrument perfect for beginners and musicians seeking authentic Ethiopian sound and spiritual connection.</p>
                <div className="flex items-baseline gap-2 mb-8 border-t border-border pt-6">
                  <span className="text-3xl font-bold text-primary">$80</span>
                  <span className="text-xs text-muted-foreground">USD</span>
                </div>
                <Button 
                  onClick={() => handleAddToCart('kirar', 'Kirar', 'Instrument', 80)}
                  className="w-full bg-primary hover:bg-primary/90 text-background py-5 text-sm font-semibold"
                >
                  Add to Cart
                </Button>
              </div>
            </Card>

            {/* Begena */}
            <Card className="bg-card border-border overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="relative h-72 bg-secondary">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-xHOkHIA7nQDL1U4Ma6c9IRlVZJyyGo.jpg"
                  alt="Begena collection - Various styles and colors"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Begena</h3>
                <p className="text-sm text-muted-foreground mb-1">Grand Ethiopian Harp</p>
                <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">10-13 stringed instrument with deep spiritual significance. A masterpiece of traditional Ethiopian craftsmanship and artistry.</p>
                <div className="flex items-baseline gap-2 mb-8 border-t border-border pt-6">
                  <span className="text-3xl font-bold text-primary">$130</span>
                  <span className="text-xs text-muted-foreground">USD</span>
                </div>
                <Button 
                  onClick={() => handleAddToCart('begena', 'Begena', 'Instrument', 130)}
                  className="w-full bg-primary hover:bg-primary/90 text-background py-5 text-sm font-semibold"
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Online Courses</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Learn Traditional Techniques</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Expert-led courses designed to teach you authentic Ethiopian instrument techniques from the comfort of your home.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[
              {
                id: 'begena',
                name: 'Begena Course',
                price: '89',
                duration: '8 weeks',
                students: 'Up to 15',
                description: 'Master the ancient 10-13 stringed Ethiopian harp. Learn traditional techniques and spiritual music practices.'
              },
              {
                id: 'kirar',
                name: 'Kirar Course',
                price: '69',
                duration: '6 weeks',
                students: 'Up to 20',
                description: 'Learn the 5-10 stringed Ethiopian lyre. Ideal for beginners and musicians of all levels.'
              }
            ].map((course, idx) => (
              <Card key={idx} className="bg-card border-border p-8 hover:border-primary/50 transition-colors">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{course.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
                  </div>
                  
                  <div className="space-y-4 border-t border-border pt-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Class Size</span>
                      <span className="font-semibold text-foreground">{course.students}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 border-t border-border pt-6">
                    <span className="text-3xl font-bold text-primary">${course.price}</span>
                    <span className="text-xs text-muted-foreground">USD total</span>
                  </div>

                  <Button 
                    onClick={() => router.push(`/enroll?course=${course.id}`)}
                    className="w-full bg-primary hover:bg-primary/90 text-background py-5 text-sm font-semibold"
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Quality & Craftsmanship</p>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Master Artisan Techniques</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Each instrument is meticulously crafted by experienced artisans using sustainable materials and traditional Ethiopian techniques perfected over generations.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Premium sustainably-sourced wood</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Traditional hand-carving techniques</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Quality tested before shipment</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-muted-foreground">Care guide and lifetime support included</span>
                </li>
              </ul>
            </div>
            <div className="relative h-80">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2026-03-01_16-29-52-axq7Rp6CWfVgLrc8ZcHNNqyZmO5g22.jpg"
                alt="Master crafted Kirar and Begena instruments collection"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Worldwide Shipping</h3>
              <p className="text-sm text-muted-foreground">Secure delivery to 50+ countries in 5-10 days</p>
            </div>
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Group Discounts</h3>
              <p className="text-sm text-muted-foreground">Special rates for groups and educational institutions</p>
            </div>
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Star className="w-8 h-8 text-primary" />
              <h3 className="text-lg font-semibold">Cultural Heritage</h3>
              <p className="text-sm text-muted-foreground">Instruments for spiritual practice and cultural connection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-secondary/20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">Connect With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Reach out through your preferred channel for inquiries or support</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://t.me/kidus626" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="bg-card border-border p-6 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center group-hover:bg-secondary/50">
                <MessageCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Telegram</h3>
                <p className="text-xs text-muted-foreground">@kidus626</p>
              </Card>
            </a>
            <a href="https://wa.me/251954789638" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="bg-card border-border p-6 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center group-hover:bg-secondary/50">
                <Phone className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">WhatsApp</h3>
                <p className="text-xs text-muted-foreground">+251 954 789 638</p>
              </Card>
            </a>
            <Link href="/contact" className="group">
              <Card className="bg-card border-border p-6 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center group-hover:bg-secondary/50">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Email</h3>
                <p className="text-xs text-muted-foreground">Contact form</p>
              </Card>
            </Link>
            <Link href="/orders" className="group">
              <Card className="bg-card border-border p-6 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center group-hover:bg-secondary/50">
                <ShoppingCart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">Account</h3>
                <p className="text-xs text-muted-foreground">View orders</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-serif font-bold text-lg mb-3">Kidus Online</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Preserving Ethiopian musical heritage through authentic instruments and expert education worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Instruments</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#instruments" className="hover:text-primary transition">Kirar</Link></li>
                <li><Link href="#instruments" className="hover:text-primary transition">Begena</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Education</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="#classes" className="hover:text-primary transition">Online Courses</Link></li>
                <li><Link href="/orders" className="hover:text-primary transition">My Account</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="https://t.me/kidus626" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">Telegram</a></li>
                <li><a href="https://wa.me/251954789638" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">WhatsApp</a></li>
                <li><Link href="/contact" className="hover:text-primary transition">Email</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
            <p>© 2026 Kidus Online. All rights reserved. Preserving Ethiopian musical traditions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
