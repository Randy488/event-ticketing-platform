import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { eventId, eventName, price } = await request.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    console.log('=== DEBUG MIDTRANS START ===');
    console.log('1. Server Key yang terbaca:', serverKey ? 'ADA (Length: ' + serverKey.length + ')' : 'TIDAK ADA/UNDEFINED');
    console.log('2. Data dari Frontend:', { eventId, eventName, price });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${eventId}-${Date.now()}`,
        gross_amount: parseInt(price), // Pastikan angka integer
      },
      customer_details: {
        first_name: "Demo User", 
        email: "demo@tiketevent.com",
      },
      item_details: [
        { 
          id: String(eventId), 
          price: parseInt(price), 
          quantity: 1, 
          name: eventName 
        },
      ],
    };

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

    // Baca respon mentah dulu
    const rawText = await response.text();
    console.log('3. Status Code dari Midtrans:', response.status);
    console.log('4. Respon Mentah Midtrans:', rawText);
    console.log('=== DEBUG MIDTRANS END ===');

    const data = JSON.parse(rawText);

    if (!data.token) {
      // Lempar error dengan pesan asli dari Midtrans
      throw new Error(`Midtrans Reject: ${data.status_message || JSON.stringify(data)}`);
    }

    return NextResponse.json({ success: true, token: data.token });

  } catch (error) {
    console.error('Final Error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}