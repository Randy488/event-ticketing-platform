'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State baru untuk upload gambar
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    price: '',
    pic_name: '',
    pic_phone: '',
  });

  useEffect(() => {
    checkAuthAndLimit();
  }, []);

  const checkAuthAndLimit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const { count, error } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', user.id);

    if (error) console.error('Error checking event count:', error);
    else setEventCount(count || 0);
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menangani upload gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Buat preview gambar di layar
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (eventCount >= 5) {
      setMessage({ type: 'error', text: 'Batas maksimal 5 event tercapai.' });
      setSubmitting(false);
      return;
    }

    if (!formData.title || !formData.date || !formData.price || !formData.pic_name || !formData.pic_phone) {
      setMessage({ type: 'error', text: 'Judul, Tanggal, Harga, Nama PIC, dan No. WA wajib diisi!' });
      setSubmitting(false);
      return;
    }

    let imageUrl = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'; // Gambar default

    // 🔒 LOGIKA UPLOAD GAMBAR KE SUPABASE STORAGE
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setMessage({ type: 'error', text: 'Gagal mengupload gambar. Coba lagi.' });
        setSubmitting(false);
        return;
      }

      // Ambil URL publik gambar yang sudah diupload
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    // Masukkan ke database
    const { error } = await supabase.from('events').insert({
      title: formData.title,
      date: formData.date,
      time: formData.time || '-',
      venue: formData.venue || '-',
      price: parseInt(formData.price.replace(/\D/g, '')) || 0,
      pic_name: formData.pic_name,
      pic_phone: formData.pic_phone,
      img: imageUrl, // 🔒 SIMPAN URL GAMBAR DI DATABASE
      creator_id: user.id,
      status: 'pending'
    });

    if (error) {
      console.error('Error creating event:', error);
      setMessage({ type: 'error', text: 'Gagal membuat event.' });
    } else {
      setMessage({ type: 'success', text: 'Event berhasil dibuat! Menunggu persetujuan admin.' });
      setFormData({ title: '', date: '', time: '', venue: '', price: '', pic_name: '', pic_phone: '' });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => {
        router.push('/eo/dashboard');
      }, 2000);
    }
    
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Memuat...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
        
        <div className="mb-8">
          <button onClick={() => router.push('/eo/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Buat Event Baru</h1>
          <p className="text-gray-500 mt-1">
            Kuota event Anda: <span className={`font-bold ${eventCount >= 5 ? 'text-red-600' : 'text-green-600'}`}>{eventCount}/5</span>
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- FIELD BARU: UPLOAD GAMBAR --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Poster Event (Opsional tapi Disarankan)</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 2MB.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Event *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Contoh: KONSER NONA 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu (Opsional)</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempat / Venue (Opsional)</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Contoh: JIExpo Kemayoran, Jakarta" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket (Rp) *</label>
            <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="Contoh: 500000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Penanggung Jawab (PIC)</h3>
            <p className="text-sm text-gray-500 mb-4">Data ini digunakan untuk verifikasi cepat oleh admin sebelum event tayang.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap PIC *</label>
                <input type="text" name="pic_name" required value={formData.pic_name} onChange={handleChange} placeholder="Sesuai KTP" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp PIC *</label>
                <input type="tel" name="pic_phone" required value={formData.pic_phone} onChange={handleChange} placeholder="Contoh: 081234567890" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || eventCount >= 5}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              eventCount >= 5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
            }`}
          >
            {submitting ? 'Mengupload & Menerbitkan...' : (eventCount >= 5 ? 'Batas Event Tercapai' : 'Ajukan Event untuk Review')}
          </button>

        </form>
      </div>
    </div>
  );
}