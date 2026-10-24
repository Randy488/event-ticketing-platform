'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  // Logika untuk membuat Akun Demo Otomatis
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const demoUser = {
        id: 1,
        name: 'Demo User',
        email: 'demo@tiketevent.com',
        phone: '081234567890',
        password: 'demo123',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([demoUser]));
    }
  }, []);

  // Data Event Unggulan dengan Foto
  const featuredEvents = [
    {
      id: 1,
      title: 'Konser Musik Indie',
      date: '15 Nov 2026',
      location: 'Jakarta',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      category: 'Konser'
    },
    {
      id: 2,
      title: 'Workshop Digital Marketing',
      date: '20 Nov 2026',
      location: 'Bandung',
      img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
      category: 'Workshop'
    },
    {
      id: 3,
      title: 'Stand Up Comedy Night',
      date: '25 Nov 2026',
      location: 'Surabaya',
      img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80',
      category: 'Comedy'
    },
    {
      id: 4,
      title: 'Festival Seni Budaya',
      date: '01 Des 2026',
      location: 'Yogyakarta',
      img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
      category: 'Festival'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative bg-indigo-600 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80" 
            alt="Background Event" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Temukan Event Terbaik <br/> di Sekitar Anda
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Beli tiket konser, workshop, stand-up comedy, dan berbagai acara menarik lainnya dengan mudah, aman, dan cepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/events" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Cari Event Sekarang
            </Link>
            <Link 
              href="/login" 
              className="bg-indigo-700 text-white border border-indigo-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-colors"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </section>

      {/* EVENT UNGGULAN */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Event Unggulan</h2>
          <Link href="/events" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Lihat Semua &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map((event) => (
            <Link 
              key={event.id} 
              href={`/events/${event.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={event.img} 
                  alt={event.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600">
                  {event.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{event.title}</h3>
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Jangan Lewatkan Event Seru!</h2>
          <p className="text-gray-600 mb-8">Daftar sekarang dan dapatkan notifikasi untuk event favoritmu.</p>
          <Link 
            href="/register" 
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Daftar Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}