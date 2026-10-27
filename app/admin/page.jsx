'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase-client';

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Konser',
    date: '',
    time: '',
    location: '', 
    venue: '', 
    price: '',
    description: '',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000' // Default image URL
  });

  // 1. Cek Login & Ambil Data Event saat halaman dimuat
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      fetchEvents();
    };
    checkAuthAndFetch();
  }, [router]);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching events:', error);
    else setEvents(data || []);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from('events').insert([
      {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        venue: formData.venue,
        price: parseInt(formData.price),
        description: formData.description,
        img: formData.img, // Langsung simpan URL gambar
      }
    ]);

    if (error) {
      alert('Gagal menambahkan event: ' + error.message);
    } else {
      alert('Event berhasil ditambahkan!');
      // Reset form ke default
      setFormData({
        title: '', category: 'Konser', date: '', time: '', location: '', venue: '', price: '', description: '',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'
      });
      setShowForm(false);
      fetchEvents(); // Refresh daftar event
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus event ini?')) return;
    
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) alert('Gagal menghapus: ' + error.message);
    else {
      alert('Event berhasil dihapus!');
      fetchEvents();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Kelola event dan pantau penjualan tiket</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Tambah Event Baru
          </button>
        </div>

        {/* Form Tambah Event */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Form Tambah Event</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Judul Event" required className="px-4 py-2 border rounded-lg" />
              
              <select name="category" value={formData.category} onChange={handleInputChange} required className="px-4 py-2 border rounded-lg">
                <option value="Konser">Konser</option>
                <option value="Workshop">Workshop</option>
                <option value="Comedy">Comedy</option>
                <option value="Festival">Festival</option>
                <option value="Seminar">Seminar</option>
              </select>

              <input name="date" type="date" value={formData.date} onChange={handleInputChange} required className="px-4 py-2 border rounded-lg" />
              <input name="time" type="time" value={formData.time} onChange={handleInputChange} required className="px-4 py-2 border rounded-lg" />
              <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Kota (misal: Jakarta)" required className="px-4 py-2 border rounded-lg" />
              <input name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Nama Gedung / Venue" required className="px-4 py-2 border rounded-lg" />
              <input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Harga Tiket (Rp)" required className="px-4 py-2 border rounded-lg" />
              
              {/* INPUT URL GAMBAR (Ringan & Cepat) */}
              <input name="img" value={formData.img} onChange={handleInputChange} placeholder="URL Gambar Poster (Copy link gambar dari internet)" className="px-4 py-2 border rounded-lg md:col-span-2" />
              
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Deskripsi Event" required className="px-4 py-2 border rounded-lg md:col-span-2" rows="3" />
              
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Daftar Event */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Event ({events.length})</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada event. Klik "Tambah Event Baru" untuk memulai.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3">Event</th>
                    <th className="px-6 py-3">Tanggal & Waktu</th>
                    <th className="px-6 py-3">Lokasi</th>
                    <th className="px-6 py-3">Harga</th>
                    <th className="px-6 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.category}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.date} <br/> {event.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{event.location}<br/><span className="text-xs text-gray-400">{event.venue}</span></td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                        Rp {event.price.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}