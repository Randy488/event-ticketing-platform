import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Sambungkan ke Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export async function GET(req) {
  return NextResponse.json({ message: 'Method not allowed, gunakan POST' });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { order_id, transaction_status, gross_amount, payment_type } = body;

    console.log(`[Webhook] Menerima data: Order ID ${order_id}, Status ${transaction_status}`);

    // Simpan ke database Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: order_id,
          transaction_status: transaction_status,
          gross_amount: gross_amount,
          payment_type: payment_type,
        },
      ]);

    if (error) {
      console.error('[Supabase Error]', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    console.log('[Sukses] Data berhasil disimpan ke database!');
    return NextResponse.json({ status: 'success', message: 'Webhook Berhasil & Data Tersimpan!' });

  } catch (error) {
    console.error('[Webhook Error]', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}