'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Komponen utama yang menggunakan useSearchParams
function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {/* ICON PENDING */}
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-12 h-12 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Pembayaran Menunggu
          </h1>
          
          <p className="text-gray-600 mb-8">
            Transaksi Anda sedang diproses. Silakan selesaikan pembayaran.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Order ID</p>
            <p className="text-xl font-bold text-gray-800 font-mono">
              {orderId || 'N/A'}
            </p>
            <p className="text-sm text-yellow-600 mt-2 font-semibold">
              ⏳ Status: Menunggu Pembayaran
            </p>
          </div>

          <div className="space-y-3">
            <Link 
              href="/events"
              className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Kembali ke Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}