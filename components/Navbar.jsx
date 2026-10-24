'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../app/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // PERBAIKAN: Cek status login dari Supabase Auth
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsLoggedIn(true);
        // Ambil nama dari metadata user atau tabel profiles
        const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
        setUserName(name);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    checkUser();

    // Dengarkan perubahan status auth (login/logout) secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsLoggedIn(true);
          const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          setUserName(name);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUserName('');
        }
      }
    );

    // Cleanup subscription saat komponen unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName('');
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            TiketEvent
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Cari Event
            </Link>

            {isLoggedIn ? (
              // Dropdown User
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block">{userName}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                      onClick={() => setShowDropdown(false)}
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <Link
                      href="/my-tickets"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                       Tiket Saya
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 Profil
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                       Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Tombol Masuk
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay untuk menutup dropdown saat klik di luar */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}