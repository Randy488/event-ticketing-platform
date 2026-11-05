import Link from 'next/link';

export default function PrivacyPage() {
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
          Kebijakan Privasi
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              1. Pengumpulan Data
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Kami menghormati privasi pengguna. Data yang kami kumpulkan meliputi:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-3">
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Nomor telepon WhatsApp</li>
              <li>Data transaksi (jenis tiket, jumlah, harga)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              2. Penggunaan Data
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Untuk pengiriman kode tiket digital</li>
              <li>Konfirmasi pembayaran dan notifikasi transaksi</li>
              <li>Komunikasi terkait event yang diikuti</li>
              <li>Improvement layanan platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              3. Perlindungan Data
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Data pribadi tidak akan dijual, disewakan, atau dibagikan kepada pihak 
              ketiga tanpa persetujuan pengguna, kecuali diwajibkan oleh hukum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              4. Keamanan Pembayaran
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Informasi pembayaran diproses secara aman oleh payment gateway yang 
              berizin Bank Indonesia. TiketEvent tidak menyimpan data kartu kredit, 
              CVV, atau informasi sensitif pembayaran lainnya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              5. Hak Pengguna
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Hak untuk mengakses data pribadi</li>
              <li>Hak untuk memperbaiki data yang tidak akurat</li>
              <li>Hak untuk meminta penghapusan data</li>
              <li>Hak untuk menarik persetujuan pemrosesan data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              6. Cookie
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna. 
              Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur 
              mungkin tidak berfungsi dengan baik.
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