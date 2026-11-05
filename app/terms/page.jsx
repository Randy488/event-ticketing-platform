import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-purple-400">
            TiketEvent
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Syarat & Ketentuan
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              1. Tentang Platform
            </h2>
            <p className="text-gray-300 leading-relaxed">
              TiketEvent adalah platform penjualan tiket event online yang mempertemukan 
              penyelenggara acara dengan peserta. Platform ini menyediakan sistem 
              pembayaran terintegrasi dan pengiriman tiket digital.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              2. Pembelian Tiket
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Pembelian tiket bersifat final dan tidak dapat dibatalkan</li>
              <li>Tiket yang telah dibeli tidak dapat dikembalikan (non-refundable)</li>
              <li>Pembeli bertanggung jawab atas keakuratan data yang dimasukkan</li>
              <li>Kode tiket akan dikirim melalui WhatsApp dan Email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              3. Penyelenggara Event
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Penyelenggara event bertanggung jawab penuh atas pelaksanaan acara, 
              termasuk kualitas acara, keamanan venue, dan pemenuhan janji yang 
              tertera dalam deskripsi event.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              4. Pembayaran
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Semua pembayaran diproses secara aman melalui payment gateway yang 
              berizin Bank Indonesia. TiketEvent tidak menyimpan data kartu kredit 
              atau informasi sensitif pembayaran.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              5. Sanksi dan Pembatalan Akun
            </h2>
            <p className="text-gray-300 leading-relaxed">
              TiketEvent berhak membatalkan akun pengguna yang terindikasi melakukan 
              kecurangan, penipuan, atau pelanggaran terhadap syarat dan ketentuan ini.
            </p>
          </section>

          <div className="border-t border-gray-700 pt-6 mt-8">
            <p className="text-gray-400 text-sm">
              Terakhir diperbarui: November 2026
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}