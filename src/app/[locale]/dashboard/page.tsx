'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push(`/${locale}/auth/login`);
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [locale, router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A3A6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F0FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-[#E0E0E0] mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#1A3A6B] mb-1">
                Welcome, {user?.user_metadata?.full_name || 'there'}!
              </h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0]">
            <h2 className="text-lg font-bold text-[#1A3A6B] mb-4">My Bookings</h2>
            <p className="text-gray-400 text-sm">No bookings yet.</p>
            <Link
              href={`/${locale}/services`}
              className="mt-4 block bg-[#F0C040] text-[#1A3A6B] text-center py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Book a Consultation
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0]">
            <h2 className="text-lg font-bold text-[#1A3A6B] mb-4">Quick Links</h2>
            <div className="flex flex-col gap-3">
              <Link href={`/${locale}/services`} className="text-[#3A6ABB] hover:underline text-sm">
                → View Services
              </Link>
              <Link href={`/${locale}/about`} className="text-[#3A6ABB] hover:underline text-sm">
                → About Nazanin
              </Link>
              <Link href={`/${locale}/contact`} className="text-[#3A6ABB] hover:underline text-sm">
                → Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
