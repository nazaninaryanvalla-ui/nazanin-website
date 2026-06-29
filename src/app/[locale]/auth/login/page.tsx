'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F0FF] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[#1A3A6B] font-bold text-2xl mb-1">NAZANIN</p>
          <p className="text-[#F0C040] text-sm font-semibold">AI Consultant</p>
          <h1 className="text-xl font-bold text-[#1A3A6B] mt-4">Sign In</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#3A6ABB]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#3A6ABB]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1A3A6B] text-white py-3 rounded-lg font-bold hover:bg-[#3A6ABB] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link href={`/${locale}/auth/register`} className="text-[#3A6ABB] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
