import Link from 'next/link';
import { Button } from '@/components/ui/button';

// A simple responsive site header with logo, optional back link, and social links.
export function Header({ backHref, backText }) {
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <span className="text-xl font-serif font-bold text-foreground">Kidus Online</span>
          </Link>

          {/* social links */}
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/channel/UCrZrZWK_7UHLAY-G16OX3HA?si=zxQEOBOBTtuiRROW"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              YouTube
            </a>
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              TikTok
            </a>
          </div>

          {backHref && (
            <Link href={backHref}>
              <Button variant="outline">{backText || 'Back'}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
