'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase-client';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // DEBUG: Cek apakah tombol benar-benar diklik
    console.log('=== TOMBOL DAFTAR DIKLIK ===');
    console.log('Data yang akan dikirim:', formData);

    setIsLoading(true);
    setError('');

    // 1. Validasi password
    if (formData.password !== formData.confirmPassword) {
      console.error('Error: Password tidak cocok');
      setError('Password tidak cocok!');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      console.error('Error: Password terlalu pendek');
      setError('Password minimal 6 karakter!');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Memulai proses registrasi ke Supabase...');

      // 2. Daftar akun di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (authError) {
        console.error('Auth Error:', authError.message);
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      console.log('Auth berhasil, user ID:', authData.user?.id);

      // 3. Simpan data profil ke tabel 'profiles'
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }
          ]);

        if (profileError) {
          console.error('Profile Insert Error:', profileError.message);
          // Kita tidak return di sini agar user tetap bisa login meskipun insert profil gagal sementara
        } else {
          console.log('Profil berhasil disimpan ke database!');
        }
      }

      // 4. Coba auto-login setelah daftar
      console.log('Mencoba auto-login...');
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        console.log('Auto-login gagal (mungkin perlu konfirmasi email). Mengarahkan ke halaman login.');
        alert(`Akun berhasil dibuat! Silakan login dengan email ${formData.email}`);
        router.push('/login');
        return;
      }

      // 5. Jika auto-login berhasil
      console.log('Auto-login berhasil! Mengarahkan ke Home.');
      alert(`Selamat datang, ${formData.name}! Akun berhasil dibuat.`);
      router.push('/');

    } catch (err) {
      console.error('Unexpected Error:', err);
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">TiketEvent</h1>
          <p className="text-gray-600">Daftar untuk mulai membeli tiket event</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Buat Akun Baru</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nama sesuai KTP"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="0812xxxxxxx"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Ulangi password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="text-xs text-gray-500">
              <p>Dengan mendaftar, Anda menyetujui</p>
              <p>
                <Link href="/terms" className="text-indigo-600 hover:underline">Syarat & Ketentuan</Link>
                {' '}dan{' '}
                <Link href="/privacy" className="text-indigo-600 hover:underline">Kebijakan Privasi</Link>
                kami.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}