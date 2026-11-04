'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🔒 Ambil email admin dari .env.local (yang tadi kita setup)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState(''); // State baru untuk simpan email lengkap
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email); // Simpan email
        setUserName(user.email ? user.email.split('@')[0] : 'User');
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserName('User');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserEmail(session.user.email); // Simpan email
        setUserName(session.user.email ? session.user.email.split('@')[0] : 'User');
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserName('User');
        setShowDropdown(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('User');
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* BARIS 1: Logo SVG + Tombol Masuk / Profil */}
        <div className="flex justify-between items-center py-2">
          
          {/* LOGO SVG INLINE */}
          <Link href="/">
            <svg 
              viewBox="0 0 500 100" 
              className="h-10 sm:h-14 md:h-20 w-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1"/>
                  <stop offset="100%" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
              <rect x="0" y="15" width="100" height="70" rx="10" fill="url(#ticketGrad)"/>
              <circle cx="0" cy="50" r="10" fill="white"/>
              <circle cx="100" cy="50" r="10" fill="white"/>
              <path d="M50 30 L30 65 L50 52 L70 65 Z" fill="white"/>
              <circle cx="30" cy="65" r="6" fill="white"/>
              <circle cx="70" cy="65" r="6" fill="white"/>
              <circle cx="50" cy="30" r="6" fill="white"/>
              <text x="115" y="50" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="#312E81">TiketEvent</text>
              <text x="115" y="72" fontFamily="Arial, sans-serif" fontSize="16" fill="#312E81">Seamless Event Ticketing</text>
            </svg>
          </Link>
          
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition text-xs sm:text-sm"
              >
                <div className="w-6 h-6 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{userName}</span>
              </button>

              {/* DROPDOWN MENU */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
                  
                  {/* 🔒 LINK KHUSUS ADMIN (Hanya muncul jika email cocok) */}
                  {userEmail === ADMIN_EMAIL && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
                      onClick={() => setShowDropdown(false)}
                    >
                      🛡️ Dashboard Admin
                    </Link>
                  )}

                  {/* LINK EO (Muncul untuk semua user yang login) */}
                  <Link 
                    href="/eo/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    📊 Dashboard EO
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-indigo-700 transition text-xs sm:text-sm"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* BARIS 2: Menu Navigasi */}
        <div className="flex justify-center items-center gap-6 py-1 pb-3">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm sm:text-base">Home</Link>
          <Link href="/events" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm sm:text-base">Cari Event</Link>
        </div>

      </div>
    </nav>
  );
}