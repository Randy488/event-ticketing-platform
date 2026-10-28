'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase-client';

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0);

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setEvent(null);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  const handleBuyTicket = () => {
    if (!event) return;
    const totalPrice = event.price * quantity;
    router.push(`/checkout?eventId=${id}&quantity=${quantity}&total=${totalPrice}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-500">Memuat data event...</div>;
  }

  if (!event) {
    return notFound();
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-96 w-full">
        {event.img ? (
          <Image src={event.img} alt={event.title} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
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
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          {/* KOLOM KANAN: Booking Card Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 border border-gray-100">
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

              {/* PEMILIH JUMLAH TIKET */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
                <div className="flex items-center border border-gray-300 rounded-lg w-max">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-800 border-x border-gray-300 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* RINGKASAN HARGA */}
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Harga per tiket</p>
                  <p className="text-sm font-medium text-gray-800">{formatPrice(event.price)}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-indigo-200">
                  <p className="text-base font-bold text-gray-800">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-indigo-600">{formatPrice(totalPrice)}</p>
                </div>
              </div>

              {/* TOMBOL BELI YANG AKTIF */}
              <button 
                onClick={handleBuyTicket}
                className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-lg mb-3 text-center"
              >
                Beli Tiket Sekarang
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}