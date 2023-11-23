import { Timestamp } from "firebase-admin/firestore";

export default async function SendCancellationTelegram(Email:string,ReservationId:String,TravelMode:String,Category:String,Payment:boolean,BoatName:String,Price:number,Contactnumber:string,BookingDate:Timestamp)
{
    const botToken = '6317566293:AAFj2P1IlI91Cap6iR8Scy_A4xvFnyJTiws';
    const chatId = '6777591451';
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const Date = BookingDate.toDate();

    const message = `An existing order has been Cancelled:
    - Email: ${Email}
    - Booking Date: ${Date}
    - Reservation Id: ${ReservationId}
    - Price: ${Price}
    - Phone Number: ${Contactnumber}
    - Payment : ${Payment}
    - Travel Mode: ${TravelMode}
    - Boat Title: ${BoatName|| 'N/A'}
    - Boat Category: ${Category || 'N/A'}
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