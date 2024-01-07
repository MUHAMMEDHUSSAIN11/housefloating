//Send telegram notification to admin upon new bookings

  export default async function SendTelegram(finalBookingDate:Date,finalHeadCount:number,finalMinorCount:number,finalPrice:number,phonenumber:String,travelMode:string,boatTitle:string,boatCategory:string) {
    const botToken = '6317566293:AAFj2P1IlI91Cap6iR8Scy_A4xvFnyJTiws';
    const chatId = '6777591451';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const message = `
    A new order has been placed:
    - Booking Date: ${finalBookingDate}
    - Guest Count: ${finalHeadCount}
    - Minor Count: ${finalMinorCount}
    - Price: ${finalPrice}
    - Phone Number: ${phonenumber}
    - Travel Mode: ${travelMode}
    - Boat Title: ${boatTitle || 'N/A'}
    - Boat Category: ${boatCategory || 'N/A'}
  `;
    // Send a Telegram message
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error sending Telegram message:', error);
        });
}