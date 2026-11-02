'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase-client';

export default function ValidatePage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null); // null, 'success', 'error'
  const [message, setMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setOrderDetails(null);

    const cleanCode = code.trim().toUpperCase();

    // 1. Cari Order di Database (Sesuai kolom 'order_id')
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', cleanCode)
      .single();

    if (error || !order) {
      setResult('error');
      setMessage('Kode Booking Tidak Ditemukan!');
      setLoading(false);
      return;
    }

    // 2. Cek Status Pembayaran (Terima 'settlement' atau 'paid')
    if (order.transaction_status !== 'settlement' && order.transaction_status !== 'paid') {
      setResult('error');
      setMessage('Pembayaran Belum Lunas / Pending!');
      setLoading(false);
      return;
    }

    // 3. Cek Apakah Sudah Pernah Masuk (Double Entry)
    // Pastikan kamu sudah tambah kolom 'checked_in' di Supabase ya!
    if (order.checked_in) {
      setResult('error');
      setMessage('⚠️ TIKET SUDAH DIGUNAKAN! (Double Entry)');
      setOrderDetails(order);
      setLoading(false);
      return;
    }

    // 4. Tandai Sudah Masuk (Update Database)
    const { error: updateError } = await supabase
      .from('orders')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('id', order.id);

    if (updateError) {
      setResult('error');
      setMessage('Gagal update status. Coba lagi.');
      setLoading(false);
      return;
    }

    // 5. Sukses!
    setResult('success');
    setMessage('TIKET VALID - BOLEH MASUK!');
    setOrderDetails(order);
    setLoading(false);
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
    setMessage('');
    setOrderDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-200">Gate Validation System</h1>
        
        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Masukkan Kode Booking</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            placeholder="Contoh: TKT-TEST123"
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl text-white text-xl font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            disabled={loading}
          />
          <button
            onClick={handleValidate}
            disabled={loading || !code.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-xl text-lg transition-colors"
          >
            {loading ? 'Memeriksa...' : 'CEK TIKET'}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className={`p-8 rounded-2xl shadow-2xl text-center transition-all duration-300 ${result === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="text-6xl mb-4">{result === 'success' ? '✅' : '🚫'}</div>
            <h2 className="text-3xl font-extrabold mb-2">{message}</h2>
            
            {orderDetails && (
              <div className="mt-6 bg-black/20 p-4 rounded-xl text-left">
                <p className="text-sm opacity-80">Order ID:</p>
                <p className="font-bold text-lg mb-2">{orderDetails.order_id}</p>
                <p className="text-sm opacity-80">Status:</p>
                <p className="font-bold text-lg text-green-300">{orderDetails.transaction_status}</p>
              </div>
            )}

            <button
              onClick={handleReset}
              className="mt-6 bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              Scan Tiket Berikutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}