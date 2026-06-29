'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Service = {
  id: string;
  name_en: string;
  duration_minutes: number;
  price_sek: number;
};

type Slot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export default function BookPage() {
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push(`/${locale}/auth/login`);
      } else {
        setUser(data.user);
      }
    });

    supabase.from('services').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setServices(data);
    });
  }, [locale, router]);

  useEffect(() => {
    if (!selectedService) return;
    const supabase = createClient();
    supabase
      .from('availability')
      .select('*')
      .eq('is_booked', false)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) setSlots(data);
      });
  }, [selectedService]);

  const handlePayment = async () => {
    if (!selectedService || !selectedSlot || !user) return;
    setPaymentLoading(true);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedService.price_sek,
          bookingDetails: {
            service_id: selectedService.id,
            slot_id: selectedSlot.id,
            user_id: user.id
          }
        })
      });

      const { clientSecret } = await res.json();
      const stripe = await stripePromise;
      if (!stripe) return;

      const supabase = createClient();
      await supabase.from('bookings').insert({
        user_id: user.id,
        service_id: selectedService.id,
        availability_id: selectedSlot.id,
        status: 'pending'
      });

      await supabase.from('availability').update({ is_booked: true }).eq('id', selectedSlot.id);

      router.push(`/${locale}/dashboard?booked=true`);
    } catch {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F0FF] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A3A6B] mb-2">Book a Consultation</h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-[#F0C040]' : 'bg-[#E0E0E0]'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {step} of 3 — {step === 1 ? 'Choose service' : step === 2 ? 'Choose time slot' : 'Payment'}
          </p>
        </div>

        {/* Step 1 — Choose Service */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0]">
            <h2 className="text-lg font-bold text-[#1A3A6B] mb-4">Choose a service</h2>
            <div className="flex flex-col gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedService?.id === service.id
                      ? 'border-[#F0C040] bg-[#FDF6D0]'
                      : 'border-[#E0E0E0] hover:border-[#3A6ABB]'
                  }`}
                >
                  <p className="font-bold text-[#1A3A6B]">{service.name_en}</p>
                  <p className="text-sm text-gray-500">{service.duration_minutes} minutes</p>
                  <p className="text-lg font-bold text-[#F0C040] mt-1">{service.price_sek} SEK</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedService}
              className="mt-6 w-full bg-[#1A3A6B] text-white py-3 rounded-xl font-bold hover:bg-[#3A6ABB] transition-colors disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Choose Slot */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0]">
            <h2 className="text-lg font-bold text-[#1A3A6B] mb-4">Choose a time slot</h2>
            {slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">No available slots yet.</p>
                <p className="text-sm text-gray-400">Check back soon or contact Nazanin directly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedSlot?.id === slot.id
                        ? 'border-[#F0C040] bg-[#FDF6D0]'
                        : 'border-[#E0E0E0] hover:border-[#3A6ABB]'
                    }`}
                  >
                    <p className="font-semibold text-[#1A3A6B] text-sm">{slot.date}</p>
                    <p className="text-xs text-gray-500">{slot.start_time} – {slot.end_time}</p>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#E0E0E0] py-3 rounded-xl font-semibold text-gray-600 hover:border-[#1A3A6B] transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
                className="flex-1 bg-[#1A3A6B] text-white py-3 rounded-xl font-bold hover:bg-[#3A6ABB] transition-colors disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Payment */}
        {step === 3 && selectedService && selectedSlot && (
          <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0]">
            <h2 className="text-lg font-bold text-[#1A3A6B] mb-4">Confirm & Pay</h2>
            <div className="bg-[#E8F0FF] rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold text-[#1A3A6B]">{selectedService.name_en}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-[#1A3A6B]">{selectedSlot.date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time</span>
                <span className="font-semibold text-[#1A3A6B]">{selectedSlot.start_time} – {selectedSlot.end_time}</span>
              </div>
              <div className="border-t border-[#E0E0E0] mt-3 pt-3 flex justify-between">
                <span className="font-bold text-[#1A3A6B]">Total</span>
                <span className="font-bold text-[#F0C040] text-xl">{selectedService.price_sek} SEK</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4 text-center">Payment processed securely via Stripe</p>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-[#E0E0E0] py-3 rounded-xl font-semibold text-gray-600 hover:border-[#1A3A6B] transition-colors">
                ← Back
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="flex-1 bg-[#F0C040] text-[#1A3A6B] py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {paymentLoading ? 'Processing...' : `Pay ${selectedService.price_sek} SEK`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
