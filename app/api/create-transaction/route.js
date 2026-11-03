import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // 1. Ambil data dari frontend (userId WAJIB dikirim dari frontend agar aman)
    const { eventId, quantity = 1, userId } = await request.json();

    if (!eventId || !userId) {
      return NextResponse.json({ error: 'Data tidak lengkap (eventId atau userId hilang)' }, { status: 400 });
    }

    // 2. Inisialisasi Supabase dengan SERVICE ROLE KEY (Bypass RLS untuk backend)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. IDEMPOTENCY CHECK (Anti Double-Click / Spam)
    // Cek apakah user ini sudah punya order PENDING untuk event ini?
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('order_id, snap_token')
      .eq('user_id', userId)
      .eq('transaction_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Jika sudah ada order pending, KEMBALIKAN TOKEN YANG SAMA (Jangan bikin order baru!)
    if (existingOrder && existingOrder.snap_token) {
      console.log('⚠️ User klik double, pakai token lama:', existingOrder.order_id);
      return NextResponse.json({ 
        success: true, 
        token: existingOrder.snap_token, 
        order_id: existingOrder.order_id 
      });
    }

    // 4. CEK DATA EVENT DI DATABASE (Anti Manipulasi Harga Frontend)
    // Catatan: Jika kolom stok di database kamu bernama 'capacity', ganti 'stock' jadi 'capacity'
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id, name, price, stock') 
      .eq('id', eventId)
      .single();

    if (eventError || !eventData) {
      return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }

    if (eventData.stock < quantity) {
      return NextResponse.json({ error: 'Maaf, stok tiket habis' }, { status: 400 });
    }

    // 5. BUAT ORDER ID UNIK & HITUNG HARGA DI BACKEND
    const orderId = `TRX-${crypto.randomBytes(4).toString('hex')}-${Date.now()}`;
    const grossAmount = eventData.price * quantity; // Harga AMAN dari database, bukan frontend!

    // 6. SIMPAN RECORD ORDER KE DATABASE (Status: Pending)
    const { error: insertError } = await supabase.from('orders').insert({
      order_id: orderId,
      user_id: userId,
      gross_amount: grossAmount,
      transaction_status: 'pending',
      payment_type: null,
      checked_in: false
    });

    if (insertError) {
      console.error('Gagal simpan order:', insertError);
      return NextResponse.json({ error: 'Gagal membuat record order' }, { status: 500 });
    }

    // 7. PANGGIL MIDTRANS SNAP API
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: "TiketEvent User",
        email: "user@tiketevent.com", // Bisa diganti dengan email user jika ada
      },
      item_details: [{
        id: String(eventData.id),
        price: eventData.price, // Harga per item dari database
        quantity: quantity,
        name: eventData.name
      }]
    };

    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
      },
      body: JSON.stringify(parameter),
    });

    const data = await response.json();

    if (!data.token) {
      throw new Error('Midtrans Error: ' + (data.status_message || 'Unknown error'));
    }

    // 8. SIMPAN TOKEN SNAP KE DATABASE (Penting untuk Idempotency step #3)
    await supabase
      .from('orders')
      .update({ snap_token: data.token }) 
      .eq('order_id', orderId);

    return NextResponse.json({ 
      success: true, 
      token: data.token, 
      order_id: orderId 
    });

  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}