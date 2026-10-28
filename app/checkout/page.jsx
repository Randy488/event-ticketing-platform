'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase-client';

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0);

function CheckoutForm() {
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

  // FUNGSI KIRIM VIA WHATSAPP (UTAMA)
  const sendTicketViaWhatsApp = () => {
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }

    const message = `🎫 *TIKET EVENT - TIKETEVENT*

Halo *${formData.name}*,

Pembayaran Anda berhasil! Berikut detail tiket:

━━━━━━━━━━━━━━━━━━━━
🎤 *${event.title}*
📅 ${event.date} • ${event.time}
📍 ${event.venue}
━━━━━━━━━━━━━━━━━━━━

👤 *Nama:* ${formData.name}
🎟️ *Jumlah Tiket:* ${quantity}
💰 *Total Bayar:* ${formatPrice(grandTotal)}

🔑 *KODE BOOKING:*
*${bookingCode}*

━━━━━━━━━━━━━━━━━━━━
📱 Tunjukkan kode booking ini kepada petugas di lokasi acara.

Terima kasih telah menggunakan TiketEvent! 🎉`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.location.href = whatsappUrl;
  };

  // FUNGSI KIRIM VIA EMAIL (OPSIONAL)
  const sendTicketViaEmail = () => {
    if (!formData.email) {
      alert('Mohon isi alamat email terlebih dahulu.');
      return;
    }
    setSendingEmail(true);
    
    const emailContent = `
TIKET EVENT - TIKETEVENT
════════════════════════════════════

Halo ${formData.name},

Pembayaran Anda berhasil! Berikut detail tiket:

════════════════════════════════════
🎤 ${event.title}
📅 ${event.date} • ${event.time}
 ${event.venue}
════════════════════════════════════

 Nama: ${formData.name}
📱 WhatsApp: ${formData.phone}
🎟️ Jumlah Tiket: ${quantity}
 Total Bayar: ${formatPrice(grandTotal)}

🔑 KODE BOOKING:
${bookingCode}

════════════════════════════════════
📱 Tunjukkan kode booking ini kepada petugas di lokasi acara.

Terima kasih telah menggunakan TiketEvent! 🎉
════════════════════════════════════
    `;

    const subject = encodeURIComponent(`Tiket ${event.title} - ${bookingCode}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:${formData.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    setTimeout(() => {
      setSendingEmail(false);
      alert(`Tiket telah dikirim ke ${formData.email}`);
    }, 1000);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  if (!event) return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"><div className="text-center"><h2 className="text-2xl font-bold text-gray-800 mb-4">Event tidak ditemukan</h2><Link href="/events" className="text-indigo-600 hover:underline">Kembali ke Daftar Event</Link></div></div>;

  // HALAMAN SUKSES (FOKUS WHATSAPP)
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Tiket untuk <strong>{event.title}</strong> telah dikonfirmasi.
          </p>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-600 mb-1 font-semibold">Kode Booking Anda:</p>
            <p className="font-mono font-bold text-indigo-700 text-2xl">{bookingCode}</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {/* TOMBOL UTAMA: WHATSAPP */}
            <button 
              onClick={sendTicketViaWhatsApp}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Kirim Tiket via WhatsApp
            </button>

            {/* TOMBOL OPSIONAL: EMAIL (Hanya muncul jika ada email) */}
            {formData.email && (
              <button 
                onClick={sendTicketViaEmail}
                disabled={sendingEmail}
                className="w-full bg-white text-blue-600 border-2 border-blue-200 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Kirim juga ke Email
                  </>
                )}
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Link href="/" className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // HALAMAN PEMBAYARAN
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
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

  // HALAMAN FORM CHECKOUT
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
                  {event.img ? <Image src={event.img} alt={event.title} fill className="object-cover" /> : <div className="w-full h-full bg-gray-300"></div>}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{event.title}</h4>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tiket</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200">-</button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 rounded-lg border border-gray-200">+</button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Bayar Sekarang
              </button>
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