'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// --- FUNGSI UNTUK LOAD MIDTRANS SNAP ---
const loadMidtransSnap = () => {
  return new Promise((resolve) => {
    if (window.snap) {
      resolve(window.snap);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
    script.onload = () => resolve(window.snap);
    document.body.appendChild(script);
  });
};

// --- KOMPONEN TOMBOL BELI TIKET ---
function BuyTicketButton({ event }) {
  const [loading, setLoading] = useState(false);

  const handleBuyTicket = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.title,
          price: event.price,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert('Gagal membuat transaksi: ' + data.message);
        setLoading(false);
        return;
      }

      const snap = await loadMidtransSnap();

      snap.pay(data.token, {
        onSuccess: function(result) { 
          window.location.href = '/payment-success?orderId=' + result.order_id;
        },
        onPending: function(result) { 
          window.location.href = '/payment-pending?orderId=' + result.order_id;
        },
        onError: function(result) { 
          alert('Pembayaran gagal. Silakan coba lagi.');
          setLoading(false); 
        },
        onClose: function() { 
          setLoading(false); 
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuyTicket}
      disabled={loading}
      className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg mb-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? 'Memproses...' : 'Beli Tiket Sekarang'}
    </button>
  );
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      // 🕵️ DETEKTIF DIMULAI DI SINI
      if (error || !data) {
        console.log("❌ ERROR ATAU DATA KOSONG:", error);
        setEvent(null);
      } else {
        console.log("✅ DATA EVENT YANG DITEMUKAN DARI DATABASE:", data.title);
        setEvent(data);
      }
      // 🕵️ DETEKTIF SELESAI DI SINI
      
      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">Memuat data event...</div>;
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-96 w-full">
        {event.img && (
          <Image src={event.img} alt={event.title} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-6xl mx-auto">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Daftar Event
            </Link>
            <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">{event.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">📍 {event.venue}</p>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Detail Event */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* KOLOM KANAN: Booking Card Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="font-semibold text-gray-800">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <p className="text-sm text-gray-500">Waktu</p>
                    <p className="font-semibold text-gray-800">{event.time}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                <p className="text-3xl font-bold text-indigo-600">{formatPrice(event.price)}</p>
              </div>

              <BuyTicketButton event={event} />

              <p className="text-xs text-gray-500 text-center mt-4">
                 Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}