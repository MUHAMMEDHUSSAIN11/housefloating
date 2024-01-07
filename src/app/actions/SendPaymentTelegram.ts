
export default  function SendPaymentTelegram(reservationId:string,BoatId:string,Date:any) {
    const botToken = '6317566293:AAFj2P1IlI91Cap6iR8Scy_A4xvFnyJTiws';
    const chatId = '6777591451';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const message = `
    ✨ Payment Success ✨
    
    A payment has been made for a reservation.
    
    Reservation ID: ${reservationId}
    Boat ID: ${BoatId}
    Date: ${Date}
    
    Please take necessary actions and ensure a smooth experience for the customer.
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


