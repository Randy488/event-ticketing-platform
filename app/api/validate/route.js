import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    // 1. Ambil QR Code / Order ID dari request frontend
    const { qr_code } = await request.json(); 

    if (!qr_code) {
      return NextResponse.json({ valid: false, message: 'Kode QR kosong!' }, { status: 400 });
    }

    // 2. Inisialisasi Supabase (Wajib Service Role untuk bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. ATOMIC UPDATE: Kunci Anti-Reuse!
    // Hanya akan berhasil jika checked_in masih FALSE
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        checked_in: true, 
        checked_in_at: new Date().toISOString() 
      })
      .eq('order_id', qr_code)
      .eq('checked_in', false) // <--- INI KUNCI MAGISNYA! Mencegah tiket dipakai 2x
      .select()
      .single();

    // 4. Cek Hasil
    if (error || !data) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Tiket Tidak Ditemukan atau Sudah Pernah Dipakai (Check-in Gagal)!' 
      }, { status: 400 });
    }

    // 5. Jika Sukses
    return NextResponse.json({ 
      valid: true, 
      message: 'Tiket VALID - Silakan Masuk!',
      data: data
    });

  } catch (error) {
    console.error('Validation Error:', error);
    return NextResponse.json({ valid: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}