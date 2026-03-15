'use client';

import Link from 'next/link';
import { MessageCircle, Phone, Mail, Youtube, Music } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif font-bold text-lg mb-3">Kidus Online</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.preservingHeritage || 'Preserving Ethiopian musical heritage through authentic instruments and expert education worldwide.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Instruments</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/#instruments" className="hover:text-primary transition">Kirar</Link></li>
              <li><Link href="/#instruments" className="hover:text-primary transition">Begena</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Education</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/#classes" className="hover:text-primary transition">Online Courses</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact & Social</h4>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li>
                <a href="https://t.me/kidus626" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition">
                  <MessageCircle className="w-4 h-4" /> Telegram
                </a>
              </li>
              <li>
                <a href="https://wa.me/251954789638" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition">
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://youtube.com/channel/UCrZrZWK_7UHLAY-G16OX3HA?si=zxQEOBOBTtuiRROW" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition">
                  <Youtube className="w-4 h-4" /> YouTube
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@mezmur0512" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition">
                  <Music className="w-4 h-4" /> TikTok
                </a>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-primary transition">
                  <Mail className="w-4 h-4" /> Email Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>© 2026 Kidus Online. {t.allRightsReserved || 'All rights reserved. Preserving Ethiopian musical traditions.'}</p>
        </div>
      </div>
    </footer>
  );
}
