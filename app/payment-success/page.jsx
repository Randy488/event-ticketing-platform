'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading untuk fetch data dari server (opsional)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat informasi pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* CARD SUKSES */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* ICON SUKSES */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* JUDUL */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pembayaran Berhasil!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Terima kasih! Tiket Anda telah berhasil dipesan.
          </p>

          {/* INFO ORDER */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Order ID</p>
            <p className="text-xl font-bold text-gray-800 font-mono">
              {orderId || 'N/A'}
            </p>
            <p className="text-sm text-green-600 mt-2 font-semibold">
              ✓ Status: Lunas
            </p>
          </div>

          {/* INSTRUKSI */}
          <div className="text-left bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-3">📧 Tiket Anda</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Tiket elektronik akan dikirim ke email Anda dalam beberapa menit. 
              Silakan cek inbox (dan folder spam) untuk melihat detail tiket.
            </p>
          </div>

          {/* TOMBOL AKSI */}
          <div className="space-y-3">
            <Link 
              href="/events"
              className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Jelajahi Event Lainnya
            </Link>
            <Link 
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Butuh bantuan? Hubungi kami di support@tiketevent.com
        </p>
      </div>
    </div>
  );
}