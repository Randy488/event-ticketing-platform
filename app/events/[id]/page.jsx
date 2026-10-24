import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const eventsData = [
  { 
    id: 1, 
    title: 'Konser Musik Indie', 
    category: 'Konser', 
    date: '15 Nov 2026', 
    time: '19:00 WIB', 
    location: 'Jakarta', 
    venue: 'Istora Senayan', 
    price: 150000, 
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80', 
    description: 'Nikmati malam penuh musik indie dari band-band lokal terbaik. Sebuah pengalaman audio-visual yang akan membawa Anda menyelami kedalaman lirik dan harmoni musik Indonesia.', 
    rundown: [
      { time: '18:00', activity: 'Pintu dibuka & Registrasi Ulang' },
      { time: '19:00', activity: 'Opening Act: Banda Neira' },
      { time: '20:00', activity: 'Guest Star: Reality Club' },
      { time: '21:30', activity: 'Headliner: Hindia' },
      { time: '23:00', activity: 'Acara Selesai' }
    ], 
    facilities: ['Parkir luas', 'Food court', 'Merchandise Booth', 'First Aid'] 
  },
  { 
    id: 2, 
    title: 'Workshop Digital Marketing', 
    category: 'Workshop', 
    date: '20 Nov 2026', 
    time: '09:00 WIB', 
    location: 'Bandung', 
    venue: 'Gedung Sate Hall', 
    price: 250000, 
    img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=80', 
    description: 'Belajar strategi digital marketing langsung dari praktisi industri. Workshop intensif 1 hari ini akan membekali Anda dengan skill SEO, Social Media Ads, dan Content Strategy yang siap pakai.', 
    rundown: [
      { time: '08:30', activity: 'Registrasi & Coffee Break' },
      { time: '09:00', activity: 'Sesi 1: Fondasi Digital Marketing (oleh Pakar SEO)' },
      { time: '11:00', activity: 'Sesi 2: Content Strategy & Copywriting' },
      { time: '13:00', activity: 'Ishoma & Networking Lunch' },
      { time: '14:00', activity: 'Sesi 3: Meta & TikTok Ads' },
      { time: '16:00', activity: 'Q&A Session & Sertifikasi' }
    ], 
    facilities: ['Sertifikat Resmi', 'Makan Siang', 'Modul Digital', 'WiFi Kencang'] 
  }, 
  { 
    id: 3, 
    title: 'Stand Up Comedy Night', 
    category: 'Comedy', 
    date: '25 Nov 2026', 
    time: '20:00 WIB', 
    location: 'Surabaya', 
    venue: 'Balai Pemuda', 
    price: 100000, 
    img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&q=80', 
    description: 'Tawa semalaman bersama komika-komika ternama Indonesia. Siapkan perut Anda karena malam ini akan penuh tawa tanpa henti! Dilarang membawa masalah, cukup bawa teman dan hati yang lapang.', 
    rundown: [
      { time: '19:30', activity: 'Pintu dibuka' },
      { time: '20:00', activity: 'Opening: Komika Baru Rising Star' },
      { time: '20:30', activity: 'Set 1: Arief Muhammad' },
      { time: '21:00', activity: 'Set 2: Ernest Prakasa' },
      { time: '21:30', activity: 'Headliner: Raditya Dika' }
    ], 
    facilities: ['Minuman Gratis', 'Merchandise Eksklusif', 'Sesi Foto Bersama'] 
  },
];

const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default async function EventDetailPage({ params }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  const event = eventsData.find((e) => e.id === id);
  
  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-96 w-full">
        <Image src={event.img} alt={event.title} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-6xl mx-auto">
            <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Daftar Event
            </Link>
            <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">{event.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
            <p className="text-white/90 text-lg">📍 {event.venue}, {event.location}</p>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Detail Event */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Rundown Acara</h2>
              <div className="space-y-4">
                {event.rundown.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-indigo-600 font-bold text-lg">{item.time}</div>
                    <div className="flex-grow pb-4 border-b border-gray-100 last:border-0">
                      <p className="text-gray-800 font-medium">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {event.facilities.map((facility, index) => (
                  <div key={index} className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg text-sm font-semibold text-center">
                    ✓ {facility}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Booking Card Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📅</div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="font-semibold text-gray-800">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <p className="text-sm text-gray-500">Waktu</p>
                    <p className="font-semibold text-gray-800">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-semibold text-gray-800">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Mulai dari</p>
                <p className="text-3xl font-bold text-indigo-600">{formatPrice(event.price)}</p>
              </div>

              {/* TOMBOL BELI TIKET (SUDAH DIUBAH JADI LINK KE CHECKOUT) */}
              <Link 
                href="/checkout" 
                className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg mb-3 text-center"
              >
                Beli Tiket Sekarang
              </Link>

              <p className="text-xs text-gray-500 text-center">
                 Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}