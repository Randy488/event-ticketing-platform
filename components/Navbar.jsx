'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setUserName('');
    setIsLoggedIn(false);
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* BARIS 1: Logo SVG + Tombol Masuk */}
        <div className="flex justify-between items-center py-2">
          
          {/* LOGO SVG INLINE - RESPONSIVE */}
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
              
              {/* Ticket Shape */}
              <rect x="0" y="15" width="100" height="70" rx="10" fill="url(#ticketGrad)"/>
              <circle cx="0" cy="50" r="10" fill="white"/>
              <circle cx="100" cy="50" r="10" fill="white"/>
              
              {/* Abstract "A" / Network */}
              <path d="M50 30 L30 65 L50 52 L70 65 Z" fill="white"/>
              <circle cx="30" cy="65" r="6" fill="white"/>
              <circle cx="70" cy="65" r="6" fill="white"/>
              <circle cx="50" cy="30" r="6" fill="white"/>
              
              {/* Text: TiketEvent */}
              <text x="115" y="50" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="#312E81">
                TiketEvent
              </text>
              
              {/* Text: Tagline */}
              <text x="115" y="72" fontFamily="Arial, sans-serif" fontSize="16" fill="#312E81">
                Seamless Event Ticketing
              </text>
            </svg>
          </Link>
          
          {/* Tombol Masuk - COMPACT */}
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition text-xs sm:text-sm"
              >
                <div className="w-5 h-5 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{userName}</span>
              </button>
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
        <div className="flex justify-center items-center gap-6 py-1">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm sm:text-base">
            Home
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-indigo-600 font-medium transition text-sm sm:text-base">
            Cari Event
          </Link>
        </div>

      </div>
    </nav>
  );
}