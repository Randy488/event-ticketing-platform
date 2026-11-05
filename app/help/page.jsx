import Link from 'next/link';

export default function HelpPage() {
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
          Pusat Bantuan
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              Hubungi Kami
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">leoragraphics@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <p className="text-white">0812-8798-7501</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="text-gray-400 text-sm">Jam Operasional</p>
                  <p className="text-white">Senin - Jumat, 09.00 - 17.00 WIB</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-purple-400">
              Pertanyaan Umum
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Bagaimana cara membeli tiket?
                </h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                  <li>Pilih event yang ingin diikuti</li>
                  <li>Pilih kategori tiket dan jumlah</li>
                  <li>Lakukan pembayaran via QRIS/Transfer Bank</li>
                  <li>Kode tiket akan dikirim ke WhatsApp dan Email</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Tiket tidak masuk ke WhatsApp/Email?
                </h3>
                <p className="text-gray-300">
                  Periksa folder Spam/Promotions di email Anda. Jika masih tidak 
                  ditemukan, hubungi kami melalui WhatsApp dengan menyertakan 
                  nama dan nomor telepon yang digunakan saat pembelian.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Apakah tiket bisa dikembalikan (refund)?
                </h3>
                <p className="text-gray-300">
                  Tiket yang telah dibeli bersifat final dan tidak dapat 
                  dikembalikan (non-refundable), kecuali event dibatalkan 
                  oleh penyelenggara.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Bagaimana cara validasi tiket di lokasi?
                </h3>
                <p className="text-gray-300">
                  Tunjukkan kode QR pada tiket digital Anda kepada petugas 
                  di pintu masuk. Petugas akan scan kode QR tersebut untuk 
                  validasi.
                </p>
              </div>
            </div>
          </section>
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