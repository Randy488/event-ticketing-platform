'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🔒 PENTING: GANTI DENGAN EMAIL ADMIN KAMU YANG SEBENARNYA!
// (Cek di Supabase > Authentication > Users, atau lihat email yang kamu pakai login)
const ADMIN_EMAIL = 'randy.test@gmail.com'; 

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'published', 'rejected'
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // 🔒 CEK APAKAH USER INI ADALAH ADMIN
    if (user.email !== ADMIN_EMAIL) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setIsAdmin(true);
    await fetchEvents();
    setLoading(false);
  };

  const fetchEvents = async () => {
    let query = supabase.from('events').select('*').order('created_at', { ascending: false });
    
    // Terapkan filter jika bukan 'all'
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
  };

  // Panggil ulang fetchEvents saat filter berubah
  useEffect(() => {
    if (isAdmin) fetchEvents();
  }, [filter]);

  const handleApprove = async (eventId) => {
    if (!confirm('Terbitkan event ini? Event akan langsung tampil di halaman publik.')) return;
    
    setActionLoading(eventId);
    const { error } = await supabase
      .from('events')
      .update({ status: 'published' })
      .eq('id', eventId);

    if (error) alert('Gagal menerbitkan event: ' + error.message);
    else await fetchEvents();
    setActionLoading(null);
  };

  const handleReject = async (eventId) => {
    if (!confirm('Tolak event ini? Event tidak akan tayang di publik.')) return;
    
    setActionLoading(eventId);
    const { error } = await supabase
      .from('events')
      .update({ status: 'rejected' })
      .eq('id', eventId);

    if (error) alert('Gagal menolak event: ' + error.message);
    else await fetchEvents();
    setActionLoading(null);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('HAPUS PERMANEN event ini? Tindakan ini tidak bisa dibatalkan!')) return;
    
    setActionLoading(eventId);
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) alert('Gagal menghapus event: ' + error.message);
    else await fetchEvents();
    setActionLoading(null);
  };

  // 🔒 TAMPILAN JIKA BUKAN ADMIN
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-red-600 mb-2">🚫 Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">Halaman ini hanya untuk Administrator TiketEvent.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  // Hitung statistik
  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    published: events.filter(e => e.status === 'published').length,
    rejected: events.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-500 mt-1">Kelola dan verifikasi semua event di platform</p>
            </div>
            <button 
              onClick={() => router.push('/')} 
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Ke Beranda
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-gray-500">Total Event</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-sm text-yellow-700">Menunggu Review</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <p className="text-sm text-green-700">Sudah Tayang</p>
            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <p className="text-sm text-red-700">Ditolak</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'pending', label: 'Pending' },
              { key: 'published', label: 'Published' },
              { key: 'rejected', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 font-medium text-sm transition whitespace-nowrap ${
                  filter === tab.key 
                    ? 'border-b-2 border-indigo-600 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Event */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {events.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Tidak ada event dengan status "{filter}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Judul Event</th>
                    <th className="px-6 py-4">PIC & Kontak</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Harga</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.venue || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-gray-900">{event.pic_name || '-'}</p>
                        {event.pic_phone && (
                          <a 
                            href={`https://wa.me/${event.pic_phone.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-xs flex items-center gap-1 mt-1"
                          >
                            💬 {event.pic_phone}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Rp {(event.price || 0).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'published' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {event.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(event.id)}
                                disabled={actionLoading === event.id}
                                className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition disabled:opacity-50"
                              >
                                {actionLoading === event.id ? '...' : '✓ Terbitkan'}
                              </button>
                              <button
                                onClick={() => handleReject(event.id)}
                                disabled={actionLoading === event.id}
                                className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition disabled:opacity-50"
                              >
                                {actionLoading === event.id ? '...' : '✗ Tolak'}
                              </button>
                            </>
                          )}
                          {event.status === 'rejected' && (
                            <button
                              onClick={() => handleApprove(event.id)}
                              disabled={actionLoading === event.id}
                              className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {actionLoading === event.id ? '...' : '↻ Publish Ulang'}
                            </button>
                          )}
                          {event.status === 'published' && (
                            <button
                              onClick={() => handleReject(event.id)}
                              disabled={actionLoading === event.id}
                              className="bg-yellow-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-yellow-700 transition disabled:opacity-50"
                            >
                              {actionLoading === event.id ? '...' : '⏸ Unpublish'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={actionLoading === event.id}
                            className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-700 transition disabled:opacity-50"
                            title="Hapus permanen"
                          >
                            🗑
                          </button>
                        </div>
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