'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Booking = {
  id: string;
  status: string;
  created_at: string;
  services: { name_en: string; price_sek: number } | null;
  availability: { date: string; start_time: string } | null;
};

type Slot = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'availability'>('bookings');

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('bookings')
      .select('*, services(name_en, price_sek), availability(date, start_time)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setBookings(data as Booking[]); });

    supabase
      .from('availability')
      .select('*')
      .order('date', { ascending: true })
      .then(({ data }) => { if (data) setSlots(data); });
  }, []);

  const addSlot = async () => {
    if (!newDate || !newStart || !newEnd) return;
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('availability')
      .insert({ date: newDate, start_time: newStart, end_time: newEnd })
      .select()
      .single();
    if (data) setSlots([...slots, data]);
    setNewDate(''); setNewStart(''); setNewEnd('');
    setSaving(false);
  };

  const deleteSlot = async (id: string) => {
    const supabase = createClient();
    await supabase.from('availability').delete().eq('id', id);
    setSlots(slots.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#E8F0FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A3A6B]">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage bookings and availability</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'bookings' ? 'bg-[#1A3A6B] text-white' : 'bg-white text-gray-600 border border-[#E0E0E0]'}`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'availability' ? 'bg-[#1A3A6B] text-white' : 'bg-white text-gray-600 border border-[#E0E0E0]'}`}
          >
            Availability ({slots.length})
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No bookings yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-[#1A3A6B] text-white text-sm">
                  <tr>
                    <th className="text-left px-4 py-3">Service</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-[#E0E0E0]">
                      <td className="px-4 py-3 text-sm">{b.services?.name_en || '—'}</td>
                      <td className="px-4 py-3 text-sm">{b.availability?.date || '—'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#F0C040]">{b.services?.price_sek} SEK</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div>
            <div className="bg-white rounded-2xl p-6 border border-[#E0E0E0] mb-6">
              <h2 className="font-bold text-[#1A3A6B] mb-4">Add New Slot</h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6ABB]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start time</label>
                  <input type="time" value={newStart} onChange={e => setNewStart(e.target.value)}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6ABB]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End time</label>
                  <input type="time" value={newEnd} onChange={e => setNewEnd(e.target.value)}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A6ABB]" />
                </div>
              </div>
              <button onClick={addSlot} disabled={saving || !newDate || !newStart || !newEnd}
                className="bg-[#F0C040] text-[#1A3A6B] px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-40">
                {saving ? 'Saving...' : '+ Add Slot'}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">
              {slots.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No slots yet. Add your first slot above.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#1A3A6B] text-white text-sm">
                    <tr>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Time</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((slot) => (
                      <tr key={slot.id} className="border-t border-[#E0E0E0]">
                        <td className="px-4 py-3 text-sm font-medium">{slot.date}</td>
                        <td className="px-4 py-3 text-sm">{slot.start_time} – {slot.end_time}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${slot.is_booked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {slot.is_booked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {!slot.is_booked && (
                            <button onClick={() => deleteSlot(slot.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
