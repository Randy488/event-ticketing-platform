import Link from 'next/link';

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Kelola Event Tanpa Pusing Urus Tiket & Pembayaran
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8">
            Platform tiket event otomatis. Peserta bayar, tiket langsung masuk WhatsApp. Anda tinggal fokus di acara.
          </p>
          <a 
            href="https://wa.me/6281287987501?text=Halo%20TiketEvent,%20saya%20tertarik%20menggunakan%20jasa%20Anda%20untuk%20event%20saya." 
            target="_blank"
            className="inline-block bg-white text-indigo-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Konsultasi Gratis via WA
          </a>
          <p className="mt-4 text-sm text-indigo-200">Lihat Demo Langsung 👇</p>
        </div>
      </section>

      {/* MASALAH (THE PAIN) */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Masih Mengelola Event dengan Cara Lama?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">😫</div>
              <h3 className="font-bold text-xl mb-2">Konfirmasi Manual</h3>
              <p className="text-gray-600">Cek mutasi bank satu-satu, balas chat peserta, rawan human error dan penipuan.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🐢</div>
              <h3 className="font-bold text-xl mb-2">Distribusi Tiket Lambat</h3>
              <p className="text-gray-600">Kirim PDF via email/WA manual. Bikin antrian panjang dan komplain di hari-H.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📉</div>
              <h3 className="font-bold text-xl mb-2">Data Berantakan</h3>
              <p className="text-gray-600">Sulit melacak siapa yang sudah bayar secara real-time. Laporan keuangan berantakan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUSI (THE HERO) */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-600">Perkenalkan: TiketEvent</h2>
          <p className="text-xl text-gray-700 mb-12">
            Sistem end-to-end yang mengotomatiskan seluruh proses penjualan tiket. Dari checkout hingga peserta scan tiket di venue.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-lg font-medium text-gray-800">
            <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-full">
              <span className="text-2xl">1️⃣</span> Buat Event
            </div>
            <div className="hidden md:block text-2xl text-gray-400">➔</div>
            <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-full">
              <span className="text-2xl">2️⃣</span> Peserta Bayar
            </div>
            <div className="hidden md:block text-2xl text-gray-400">➔</div>
            <div className="flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-full">
              <span className="text-2xl">3️⃣</span> Tiket Otomatis ke WA
            </div>
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kenapa EO Memilih Kami?</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl">💳</div>
              <div>
                <h3 className="font-bold text-xl mb-1">Pembayaran Terintegrasi (Midtrans)</h3>
                <p className="text-gray-600">Terima QRIS (GoPay, OVO, DANA), Virtual Account BCA, BSI, dan Kartu Kredit. Dana aman & cair cepat.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-bold text-xl mb-1">Tiket Instan via WhatsApp</h3>
                <p className="text-gray-600">Kode booking unik & detail tiket otomatis terkirim ke WA pembeli detik setelah pembayaran sukses.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="font-bold text-xl mb-1">Dashboard Real-time</h3>
                <p className="text-gray-600">Pantau jumlah tiket terjual, pendapatan, dan data peserta secara langsung kapan saja.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="py-16 px-6 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Lihat Sendiri Kemudahannya</h2>
          <p className="text-lg mb-8 text-indigo-100">
            Coba alur pemesanan dari awal sampai tiket masuk ke WhatsApp Anda. Tanpa registrasi ribet.
          </p>
          <Link 
            href="/events"
            className="inline-block bg-white text-indigo-700 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition"
          >
            Buka Demo Website 🚀
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Siap Membuat Event Anda Lebih Profesional?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Diskusikan kebutuhan event Anda dengan kami. Konsultasi gratis, tanpa komitmen.
          </p>
          <a 
            href="https://wa.me/6281287987501?text=Halo%20TiketEvent,%20saya%20tertarik%20menggunakan%20jasa%20Anda%20untuk%20event%20saya." 
            target="_blank"
            className="inline-block bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-green-600 transition flex items-center gap-2 mx-auto w-fit"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Chat WhatsApp Sekarang
          </a>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2026 TiketEvent. Seamless Event Ticketing.</p>
      </footer>
    </div>
  );
}