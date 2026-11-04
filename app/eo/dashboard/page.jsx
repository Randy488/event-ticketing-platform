'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function EODashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      router.push('/login');
      return;
    }

    const { data: eventsData, error } = await supabase
      .from('events')
      .select('*') 
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(eventsData || []);
      // Hitung Total Event
      setStats(prev => ({ ...prev, totalEvents: (eventsData || []).length }));
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">Memuat dashboard EO...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard EO</h1>
              <p className="text-gray-500 mt-1">Kelola event dan pantau penjualan tiket Anda</p>
            </div>
            {/* Tombol ini akan kita hubungkan ke halaman Create Event nanti */}
            <button
              onClick={() => router.push('/eo/create-event')} 
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium shadow-sm"
            >
              + Buat Event Baru
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KARTU STATISTIK (TASK #2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Event Aktif</div>
            <div className="text-4xl font-bold text-purple-600">{stats.totalEvents}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Tiket Terjual</div>
            <div className="text-4xl font-bold text-blue-600">{stats.totalTicketsSold}</div>
            <p className="text-xs text-gray-400 mt-1">*Akan terhubung ke tabel orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Pendapatan</div>
            <div className="text-4xl font-bold text-green-600">Rp {stats.totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-gray-400 mt-1">*Akan terhubung ke tabel orders</p>
          </div>
        </div>

        {/* TABEL EVENT */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Event Anda</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-500 mb-4">Belum ada event yang dibuat.</p>
              <button
                onClick={() => router.push('/eo/create-event')}
                className="text-purple-600 font-medium hover:text-purple-800"
              >
                Buat event pertama Anda sekarang &rarr;
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Judul Event</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Tempat</th>
                    <th className="px-6 py-4">Harga Tiket</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{event.title || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{event.time || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{event.venue || '-'}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">Rp {(event.price || 0).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => router.push(`/events/${event.id}`)} className="text-purple-600 hover:text-purple-800 font-medium text-sm">Lihat Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}