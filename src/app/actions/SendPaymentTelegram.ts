import { Timestamp } from "firebase/firestore";
import { Telegram } from "../enums/enums";
import dayjs from 'dayjs';

export default async function SendPaymentTelegram(reservationId: string, BoatId: string, BoatName : string,date: any , email : string | undefined, contactNumber : string) {
    const formattedDate = dayjs(Date.now()).format('dddd, MMMM D, YYYY h:mm A');
    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;
    const message = `
    ✨ Payment Success ✨
    
    A payment has been made for a reservation.
    
    Reservation ID: ${reservationId}

    Boat ID: ${BoatId}

    Booking Date: ${date}

    User Email : ${email}

    Paid Date : ${formattedDate}
    
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
        .catch(error => {
            console.error('Error sending Telegram message:', error);
        });
}


