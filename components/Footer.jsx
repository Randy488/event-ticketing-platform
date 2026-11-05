import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom 1: Brand TiketEvent */}
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              TiketEvent
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform tiket event terpercaya di Indonesia. <br />
              Menjual kebahagiaan dalam setiap acara.
            </p>
          </div>

          {/* Kolom 2: Perusahaan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Perusahaan
            </h3>
            <ul className="space-y-2">
              <li>
                {/* Pakai tag 'a' biasa dengan href="#" karena halamannya belum ada */}
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Bantuan */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Bantuan
            </h3>
            <ul className="space-y-2">
              <li>
                {/* Pakai Link dari Next.js agar tidak reload halaman */}
                <Link href="/help" className="text-gray-400 hover:text-white transition text-sm">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition text-sm">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition text-sm">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Garis Pemisah & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Event Ticketing Platform. All rights reserved. Dibuat dengan ❤️ di Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}