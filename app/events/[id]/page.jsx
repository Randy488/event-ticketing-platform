'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase-client';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchEvent() {
      if (!params.id) return;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .eq('status', 'published') // 🔒 TAMBAHKAN BARIS INI: Hanya ambil event yang sudah dipublish
        .single();
        
      if (data) setEvent(data);
      setLoading(false);
    }
    fetchEvent();
  }, [params.id]);

  // 🔒 JIKA EVENT TIDAK DITEMUKAN (KARENA PENDING, DIHAPUS, ATAU ID SALAH)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }
  
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Tidak Tersedia</h1>
          <p className="text-gray-600 mb-6">Event ini sedang dalam peninjauan admin, sudah dibatalkan, atau tidak ditemukan.</p>
          <Link href="/events" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition">
            ← Kembali ke Daftar Event
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img 
          src={event.img || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200'} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Tentang Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description || 'Tidak ada deskripsi detail untuk event ini.'}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Event</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Tanggal & Waktu</p>
                    <p className="text-gray-600">{event.date} {event.time ? `pukul ${event.time}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Lokasi</p>
                    <p className="text-gray-600">{event.venue || event.location || 'Lokasi akan diumumkan'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24 border border-gray-100">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Harga per tiket</p>
                <p className="text-3xl font-bold text-indigo-600">Rp {event.price?.toLocaleString('id-ID')}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl hover:bg-gray-200 transition"
                  >-</button>
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl hover:bg-gray-200 transition"
                  >+</button>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-xl font-bold text-indigo-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/checkout?eventId=${event.id}&quantity=${quantity}`)} 
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm"
              >
                Pesan Tiket Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}