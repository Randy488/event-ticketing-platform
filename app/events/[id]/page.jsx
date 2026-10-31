'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { events } from '../../../data/events';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const event = events.find(e => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event tidak ditemukan</h1>
          <button 
            onClick={() => router.push('/events')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Kembali ke Daftar Event
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = event.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className="inline-block bg-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-2 uppercase">
            {event.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold">{event.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Event Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Tentang Event</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Informasi Event</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Tanggal</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold text-gray-900">Waktu</p>
                    <p className="text-gray-600">{event.time} WIB</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Lokasi</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎟️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Kursi Tersedia</p>
                    <p className="text-gray-600">{event.seats} kursi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Harga per tiket</p>
                <p className="text-3xl font-bold text-indigo-600">
                  Rp {event.price.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Tiket
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  
                  <div className="flex-1 text-center">
                    <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                  </div>
                  
                  <button 
                    onClick={() => setQuantity(Math.min(event.seats, quantity + 1))}
                    className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-indigo-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => router.push(`/checkout?eventId=${event.id}&quantity=${quantity}`)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                Pesan Tiket Sekarang
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Tiket akan dikirim via WhatsApp setelah pembayaran
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}