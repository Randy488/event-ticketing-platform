import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Data logo dengan warna brand asli dan ikon SVG
  const paymentLogos = [
    { name: 'QRIS', color: '#E31E24', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v3h-3v-3zm-3 0h2v2h-2v-2zm0 3h2v3h-2v-3zM13 3h2v2h-2V3zm0 4h2v6h-2V7zm0 8h2v6h-2v-6z"/></svg> },
    { name: 'BCA', color: '#0060AF', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
    { name: 'Mandiri', color: '#003366', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20H5.5L12 5.5z"/></svg> },
    { name: 'BNI', color: '#F05A22', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
    { name: 'BRI', color: '#00529C', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> },
    { name: 'GoPay', color: '#00AED6', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg> },
    { name: 'OVO', color: '#4C3494', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> },
    { name: 'DANA', color: '#108EE9', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> },
    { name: 'ShopeePay', color: '#EE4D2D', icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg> },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* BAGIAN TRUST & PAYMENT LOGOS */}
        <div className="border-b border-gray-800 pb-8 mb-8">
          <p className="text-center text-gray-400 text-sm mb-6 font-medium uppercase tracking-wider flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Transaksi 100% Aman & Terverifikasi
          </p>
          
          {/* GRID LOGO BAR */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {paymentLogos.map((logo) => (
              <div 
                key={logo.name} 
                className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
              >
                <div className="w-5 h-5 flex items-center justify-center" style={{ color: logo.color }}>
                  {logo.icon}
                </div>
                <span className="font-bold text-sm text-gray-800">{logo.name}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-6">
            Diproses secara aman oleh Payment Gateway berizin Bank Indonesia.
          </p>
        </div>

        {/* BAGIAN LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold mb-3 text-indigo-400">TiketEvent</h4>
            <p className="text-gray-400 text-sm">
              Platform tiket event terpercaya di Indonesia. Menjual kebahagiaan dalam setiap acara.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-3 text-white">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-3 text-white">Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Event Ticketing Platform. All rights reserved. Dibuat dengan ❤️ di Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}