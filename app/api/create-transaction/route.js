import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Ambil data dari frontend
    const { eventId, eventName, price } = await request.json();
    
    // 2. Ambil Server Key dari Environment Variable
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    // 3. Buat parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: `ORDER-${eventId}-${Date.now()}`, // Order ID harus unik
        gross_amount: price,
      },
      customer_details: {
        first_name: "Demo User", 
        email: "demo@tiketevent.com",
      },
      item_details: [
        { 
          id: eventId, 
          price: price, 
          quantity: 1, 
          name: eventName 
        },
      ],
    };

    // 4. Request Snap Token ke Midtrans Sandbox
    const response = await fetch(
      'https://app.sandbox.midtrans.com/snap/v1/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(serverKey + ':').toString('base64'),
        },
        body: JSON.stringify(parameter),
      }
    );

    const data = await response.json();

    // 5. Cek apakah token berhasil didapat
    if (!data.token) {
      throw new Error(data.status_message || 'Gagal mendapatkan Snap Token');
    }

    // 6. Kirim token kembali ke frontend
    return NextResponse.json({ 
      success: true, 
      token: data.token 
    });

  } catch (error) {
    console.error('Midtrans Create Transaction Error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}