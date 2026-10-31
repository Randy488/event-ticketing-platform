import Link from 'next/link';
import { supabase } from '../lib/supabase-client';

export default async function EventsPage() {
  // Ambil SEMUA event dari Supabase
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Semua Event</h1>
        
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform group-hover:-translate-y-1">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image_url || event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-indigo-600 font-bold text-lg">
                        Rp {event.price?.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl mt-10">Belum ada event yang tersedia.</p>
        )}
      </div>
    </div>
  );
}