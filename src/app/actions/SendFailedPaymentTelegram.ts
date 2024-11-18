import { Timestamp } from "firebase/firestore";
import { Telegram } from "../enums/enums";

export default function SendFailedPaymentTelegram(reservationId: string | undefined, BoatId: string | undefined, Date: any, userEmail : string | undefined,errorMessage : string | undefined) {
    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;
    const message = `
    !!! Payment Failed !!!
    
    A payment has been failed for a reservation.
    
    Reservation ID: ${reservationId}
    Boat ID: ${BoatId}
    Booking Date: ${Date}
    Email : ${userEmail}
    Paid Date : ${Timestamp.now()}
    Error Message : ${errorMessage}
    
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


