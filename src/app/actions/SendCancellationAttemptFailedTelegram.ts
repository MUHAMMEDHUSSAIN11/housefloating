import { Timestamp } from "firebase-admin/firestore";
import { Telegram } from "../enums/enums";
import dayjs from "dayjs";

export default async function SendCancellationAttemptFailedTelegram(Email: string, ReservationId: String, TravelMode: String, Category: String, Payment: boolean, BoatName: String, Price: number, Contactnumber: string, BookingDate: Timestamp) {
    const formattedDate = dayjs(Date.now()).format('dddd, MMMM D, YYYY h:mm A');

    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;
    const bookingDate = BookingDate.toDate();

    const message = `An order has been tried to cancel but failed:
    - Email: ${Email}
    - Booking Date: ${bookingDate}
    -  Id: ${ReservationId}
    - Price: ${Price}
    - Phone Number: ${Contactnumber}
    - Payment : ${Payment}
    - Travel Mode: ${TravelMode}
    - Boat Title: ${BoatName || 'N/A'}
    - Cancelled Date : ${formattedDate}
    - Boat Category: ${Category || 'N/A'}`;

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