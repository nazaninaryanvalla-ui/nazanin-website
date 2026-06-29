'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const locales = [
    { code: 'en', label: 'EN' },
    { code: 'sv', label: 'SV' },
    { code: 'fa', label: 'FA' }
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/contact`, label: t('contact') }
  ];

  return (
    <nav className="bg-[#1A3A6B] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wide">NAZANIN</span>
          <span className="text-[#F0C040] text-sm hidden sm:block">AI Consultant</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-100 hover:text-[#F0C040] transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLocale(l.code)}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  locale === l.code
                    ? 'bg-[#F0C040] text-[#1A3A6B]'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {user ? (
            <Link
              href={`/${locale}/dashboard`}
              className="hidden md:block bg-[#F0C040] text-[#1A3A6B] px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="hidden md:block bg-[#F0C040] text-[#1A3A6B] px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
            >
              {t('bookConsultation')}
            </Link>
          )}

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#1A3A6B] border-t border-blue-800 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-blue-100 hover:text-[#F0C040] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/services`}
            className="bg-[#F0C040] text-[#1A3A6B] px-4 py-2 rounded-lg text-sm font-bold text-center"
            onClick={() => setMenuOpen(false)}
          >
            {t('bookConsultation')}
          </Link>
        </div>
      )}
    </nav>
  );
}
