import { Telegram } from "../enums/enums";

export default function SendPaymentTelegram(reservationId: string, BoatId: string, Date: any) {
    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;
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
            chat_id: Telegram.chatId,
            text: message,
        }),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error sending Telegram message:', error);
        });
}


