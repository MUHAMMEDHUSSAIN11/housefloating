//Send telegram notification to admin upon new bookings
import { Telegram } from "../enums/enums";

export default async function SendRequestTelegram(finalBookingDate: Date, finalHeadCount: number, 
    finalMinorCount: number, finalPrice: number, 
    phonenumber: String, travelMode: string, 
    boatTitle: string, boatCategory: string,
    boatRoomCount:number) {
    const apiUrl = `https://api.telegram.org/bot${Telegram.botToken}/sendMessage`;

    const message = `
    A NEW ORDER has been placed:
    - Booking Date: ${finalBookingDate}
    - Guest Count: ${finalHeadCount}
    - Minor Count: ${finalMinorCount}
    - Price: ${finalPrice}
    - Phone Number: ${phonenumber}
    - Travel Mode: ${travelMode}
    - Boat Title: ${boatTitle}
    - Boat RoomCount: ${boatRoomCount}
    - Boat Category: ${boatCategory}
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