'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase-client';

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0);

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const urlQuantity = parseInt(searchParams.get('quantity')) || 1;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(urlQuantity);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState('form');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [bookingCode] = useState(() => 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return;
      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (data) setEvent(data);
      setLoading(false);
    }
    fetchEvent();
  }, [eventId]);

  const totalPrice = event ? event.price * quantity : 0;
  const serviceFee = 5000 * quantity;
  const grandTotal = totalPrice + serviceFee;

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckout = (e) => { e.preventDefault(); setStep('payment'); };
  const handlePaymentDone = () => setStep('success');

  const sendTicketViaWhatsApp = () => {
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.substring(1);
    const message = `🎫 *TIKET EVENT - TIKETEVENT*\n\nHalo *${formData.name}*,\n\nPembayaran Anda berhasil! Berikut detail tiket:\n\n━━━━━━━━━━━━━━━━━━━━\n🎤 *${event.title}*\n📅 ${event.date} • ${event.time || ''}\n📍 ${event.venue || event.location}\n━━━━━━━━━━━━━━━━━━━━\n\n👤 *Nama:* ${formData.name}\n🎟️ *Jumlah Tiket:* ${quantity}\n💰 *Total Bayar:* ${formatPrice(grandTotal)}\n\n🔑 *KODE BOOKING:*\n*${bookingCode}*\n\n━━━━━━━━━━━━━━━━━━━━\n📱 Tunjukkan kode booking ini kepada petugas di lokasi acara.\n\nTerima kasih telah menggunakan TiketEvent! 🎉`;
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const sendTicketViaEmail = () => {
    if (!formData.email) { alert('Mohon isi alamat email terlebih dahulu.'); return; }
    setSendingEmail(true);
    const emailContent = `TIKET EVENT - TIKETEVENT\n════════════════════════════════════\n\nHalo ${formData.name},\n\nPembayaran Anda berhasil! Berikut detail tiket:\n\n════════════════════════════════════\n🎤 ${event.title}\n📅 ${event.date} • ${event.time || ''}\n📍 ${event.venue || event.location}\n════════════════════════════════════\n\n👤 Nama: ${formData.name}\n📱 WhatsApp: ${formData.phone}\n🎟️ Jumlah Tiket: ${quantity}\n💰 Total Bayar: ${formatPrice(grandTotal)}\n\n🔑 KODE BOOKING:\n${bookingCode}\n\n════════════════════════════════════\n📱 Tunjukkan kode booking ini kepada petugas di lokasi acara.\n\nTerima kasih telah menggunakan TiketEvent! 🎉\n════════════════════════════════════`;
    const subject = encodeURIComponent(`Tiket ${event.title} - ${bookingCode}`);
    const body = encodeURIComponent(emailContent);
    window.location.href = `mailto:${formData.email}?subject=${subject}&body=${body}`;
    setTimeout(() => { setSendingEmail(false); alert(`Tiket telah dikirim ke ${formData.email}`); }, 1000);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!event) return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"><div className="text-center"><h2 className="text-2xl font-bold text-gray-800 mb-4">Event tidak ditemukan</h2><button onClick={() => router.push('/')} className="text-indigo-600 hover:underline font-semibold">Kembali ke Beranda</button></div></div>;

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil! 🎉</h2>
          <p className="text-gray-600 mb-6">Tiket untuk <strong>{event.title}</strong> telah dikonfirmasi.</p>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-600 mb-1 font-semibold">Kode Booking Anda:</p>
            <p className="font-mono font-bold text-indigo-700 text-2xl">{bookingCode}</p>
          </div>
          <div className="space-y-3 mb-6">
            <button onClick={sendTicketViaWhatsApp} className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg">Kirim Tiket via WhatsApp</button>
            {formData.email && (
              <button onClick={sendTicketViaEmail} disabled={sendingEmail} className="w-full bg-white text-blue-600 border-2 border-blue-200 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {sendingEmail ? 'Mengirim...' : 'Kirim juga ke Email'}
              </button>
            )}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <Link href="/" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Selesaikan Pembayaran</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            {paymentMethod === 'qris' && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 inline-block mb-6">
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-gray-400 text-sm">QRIS Placeholder<br/>(Demo Mode)</span>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <button onClick={handlePaymentDone} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg">✓ Saya Sudah Bayar</button>
              <button onClick={() => setStep('form')} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Kembali ke Form</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href={`/events/${event.id}`} className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-4 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Detail Event
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Checkout & Pembayaran</h1>
        </div>
        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Data Pembeli</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Sesuai KTP" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email (Opsional)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@contoh.com" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0812xxxxxxx" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Metode Pembayaran</h2>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'qris' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <div><p className="font-semibold">QRIS</p><p className="text-sm text-gray-500">GoPay, OVO, DANA, ShopeePay</p></div>
                  </div>
                  <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">POPULER</span>
                </label>
                <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer ${paymentMethod === 'bca' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" value="bca" checked={paymentMethod === 'bca'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-indigo-600" />
                    <div><p className="font-semibold">Virtual Account BCA</p></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <img 
                    src={event.img} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50">-</button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Biaya Layanan</span>
                <span className="font-medium">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 border-t pt-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">Bayar Sekarang</button>
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