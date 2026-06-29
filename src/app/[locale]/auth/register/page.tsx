'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

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
          <h1 className="text-xl font-bold text-[#1A3A6B] mt-4">Create Account</h1>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#3A6ABB]"
              placeholder="Your full name"
            />
          </div>
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
              minLength={6}
              className="w-full border border-[#E0E0E0] rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#3A6ABB]"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#F0C040] text-[#1A3A6B] py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href={`/${locale}/auth/login`} className="text-[#3A6ABB] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
