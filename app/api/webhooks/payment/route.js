import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  return NextResponse.json({ message: 'Webhook is running! Method GET works.' });
}

export async function POST(req) {
  try {
    console.log('[Webhook] Starting payment webhook...');
    
    // Ambil environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;
    
    console.log('[Debug] Supabase URL:', supabaseUrl ? 'ADA' : 'TIDAK ADA');
    console.log('[Debug] Supabase Key:', supabaseServiceKey ? 'ADA (Length: ' + supabaseServiceKey.length + ')' : 'TIDAK ADA');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials tidak lengkap!');
    }

    // Parse body
    const body = await req.json();
    const { order_id, transaction_status, gross_amount, payment_type } = body;

    console.log(`[Webhook] Menerima data: Order ID ${order_id}, Status ${transaction_status}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Insert ke database
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: order_id,
          transaction_status: transaction_status,
          gross_amount: parseFloat(gross_amount),
          payment_type: payment_type,
        },
      ])
      .select();

    if (error) {
      console.error('[Supabase Error] Detail:', error);
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    console.log('[Sukses] Data berhasil disimpan ke database:', data);
    return NextResponse.json({ 
      status: 'success', 
      message: 'Webhook Berhasil & Data Tersimpan!',
      data: data 
    });

  } catch (error) {
    console.error('[Webhook Error]', error);
    return NextResponse.json(
      { status: 'error', message: error.message }, 
      { status: 500 }
    );
  }
}