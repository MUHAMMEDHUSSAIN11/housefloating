import dayjs from "dayjs";
import { Telegram } from "../enums/enums";

export default async function SendFailedPaymentTelegram(reservationId: string | undefined, BoatId: string | undefined, BoatName : string | undefined,bookingDate: any, userEmail : string | undefined,errorMessage : string | undefined, ContactNumber : string | undefined) {
    const formattedDate = dayjs(Date.now()).format('dddd, MMMM D, YYYY h:mm A');
    
    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;
    const message = `
    !!! Payment Failed !!!
    
    A payment has been failed for a reservation.
    
    - Reservation ID: ${reservationId}

    - Boat ID: ${BoatId}
    
    - Boat Name: ${BoatName}
    
    - Booking Date: ${bookingDate}
    
    - Email : ${userEmail}
    
    - Contact Number : ${ContactNumber}
    
    - Payment Try Date : ${formattedDate}
    
    - Error Message : ${errorMessage}
    
    Please take necessary actions and ensure a smooth experience for the customer.
    `;
    // Send a Telegram message
   await fetch(apiUrl, {
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


