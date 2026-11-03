import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Inisialisasi Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Buat aturan: Maksimal 5 request per 60 detik per IP address
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

export async function middleware(request) {
  const ip = request.ip ?? '127.0.0.1';
  
  // Hanya proteksi endpoint kritis (checkout & validasi)
  if (request.nextUrl.pathname.startsWith('/api/create-transaction') || 
      request.nextUrl.pathname.startsWith('/api/validate')) {
    
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      // Jika melebihi batas, blokir request
      return new NextResponse('Terlalu banyak permintaan. Silakan tunggu 1 menit.', { 
        status: 429 
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};