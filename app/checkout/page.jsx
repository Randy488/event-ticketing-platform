'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const mockEvent = {
  id: 1,
  title: 'Konser Musik Indie',
  date: '15 Nov 2026',
  time: '19:00 WIB',
  venue: 'Istora Senayan, Jakarta',
  price: 150000,
  img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
};

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

function CheckoutForm() {
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState('form'); // 'form', 'payment', 'success'
  const [timeLeft, setTimeLeft] = useState(600); // 10 menit dalam detik

  const totalPrice = mockEvent.price * quantity;
  const serviceFee = 5000 * quantity;
  const grandTotal = totalPrice + serviceFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentDone = () => {
    setStep('success');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // HALAMAN SUKSES
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Tiket untuk <strong>{mockEvent.title}</strong> telah dikirim ke email <strong>{formData.email}</strong>.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
            <p>Kode Booking: <span className="font-mono font-bold text-gray-800">TKT-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span></p>
          </div>
          <Link href="/" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // HALAMAN PEMBAYARAN (QRIS / VA / E-WALLET)
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selesaikan Pembayaran</h2>
              <p className="text-gray-500">Silakan selesaikan pembayaran dalam waktu:</p>
              <div className="mt-3 inline-block bg-red-50 border-2 border-red-200 rounded-lg px-6 py-3">
                <span className="text-2xl font-bold text-red-600 font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Info Pembayaran */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Metode</span>
                <span className="font-semibold text-gray-700 uppercase">
                  {paymentMethod === 'qris' && 'QRIS'}
                  {paymentMethod === 'bca' && 'Virtual Account BCA'}
                  {paymentMethod === 'gopay' && 'GoPay / OVO / DANA'}
                </span>
              </div>
            </div>

            {/* QRIS QR Code */}
            {paymentMethod === 'qris' && (
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">Scan QRIS di bawah dengan aplikasi e-wallet Anda:</p>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 inline-block">
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="text-xs text-gray-500">QRIS Code</p>
                      <p className="text-xs text-gray-400 mt-1">Simulasi Demo</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-xs text-gray-500">Didukung oleh:</span>
                    <span className="text-xs font-bold text-blue-600">QRIS</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Buka aplikasi <strong>GoPay, OVO, DANA, ShopeePay, atau Mobile Banking</strong> Anda, lalu scan kode di atas.
                </p>
              </div>
            )}

            {/* Virtual Account BCA */}
            {paymentMethod === 'bca' && (
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">Transfer ke Virtual Account berikut:</p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <p className="text-sm text-gray-500 mb-2">Nomor Virtual Account BCA</p>
                  <p className="text-3xl font-bold text-blue-700 font-mono tracking-wider">8808 0123 4567 8901</p>
                  <p className="text-sm text-gray-500 mt-3">Atas Nama: <span className="font-semibold text-gray-700">{formData.name || 'NAMA PEMBELI'}</span></p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Transfer melalui <strong>ATM, Mobile Banking, atau Internet Banking BCA</strong>.
                </p>
              </div>
            )}

            {/* E-Wallet */}
            {paymentMethod === 'gopay' && (
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">Anda akan diarahkan ke aplikasi e-wallet:</p>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">G</div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">O</div>
                    <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">D</div>
                  </div>
                  <p className="text-sm text-gray-600">GoPay / OVO / DANA</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{formatPrice(grandTotal)}</p>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Klik tombol di bawah untuk simulasi pembayaran via e-wallet.
                </p>
              </div>
            )}

            {/* Tombol Aksi */}
            <div className="mt-8 space-y-3">
              <button 
                onClick={handlePaymentDone}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                ✓ Saya Sudah Bayar
              </button>
              <button 
                onClick={() => setStep('form')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Kembali ke Form
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Transaksi dienkripsi & 100% Aman
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HALAMAN FORM CHECKOUT (ASLI)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/events/1" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Detail Event
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Checkout & Pembayaran</h1>
          <p className="text-gray-500">Lengkapi data diri Anda untuk melanjutkan pembelian tiket.</p>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Data Pembeli
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    required 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Sesuai dengan KTP" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                    <input 
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contoh@email.com" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0812xxxxxxx" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Metode Pembayaran
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-800">QRIS</p>
                      <p className="text-sm text-gray-500">Scan pakai GoPay, OVO, DANA, ShopeePay, atau Mobile Banking</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">POPULER</span>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bca' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="bca" checked={paymentMethod === 'bca'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Virtual Account BCA</p>
                      <p className="text-sm text-gray-500">Transfer via ATM, Mobile Banking, atau Internet Banking BCA</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'gopay' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="gopay" checked={paymentMethod === 'gopay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-800">GoPay / OVO / DANA</p>
                      <p className="text-sm text-gray-500">Pembayaran instan via aplikasi e-wallet</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={mockEvent.img} alt={mockEvent.title} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{mockEvent.title}</h4>
                  <p className="text-xs text-gray-500 mb-1">{mockEvent.date} • {mockEvent.time}</p>
                  <p className="text-xs text-gray-500">{mockEvent.venue}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Harga Tiket ({quantity}x)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Biaya Layanan</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-800">Total Pembayaran</span>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Bayar Sekarang
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transaksi dienkripsi & 100% Aman
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}