'use server'

import twilio from 'twilio';

export async function sendOwnerWhatsAppConfirmation(data: {
    boatName: string;
    tripDate: string;
    cruiseType: string;
    bookingId: string;
    guestName: string;
    guestPlace: string;
    totalAmount: number;
    advance: number;
    balance: number;
    ownerPhoneNumber: string;
}) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886';

    // Format the date to DD/MM/YYYY
    const date = new Date(data.tripDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Clean phone number: remove any non-digit characters (like + or -)
    const cleanPhone = data.ownerPhoneNumber.replace(/\D/g, '');

    // Template params in order matching {{1}} to {{9}} for owner_confirmation
    const contentVariables = JSON.stringify({
        "1": data.boatName,
        "2": formattedDate,
        "3": data.cruiseType,
        "4": data.bookingId,
        "5": data.guestName,
        "6": data.guestPlace,
        "7": data.totalAmount.toString(),
        "8": data.advance.toString(),
        "9": data.balance.toString()
    });

    try {
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            contentSid: 'HX240da9e6681b51de0df8d9d7fe85d38f',
            from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
            to: `whatsapp:+${cleanPhone}`,
            contentVariables: contentVariables
        });

        console.log("Twilio Owner Response SID:", message.sid);
        return { success: true, message: "Owner WhatsApp message sent successfully." };
    } catch (error) {
        console.error("Owner WhatsApp Send Error:", error);
        return { success: false, message: "Internal server error while sending owner WhatsApp message." };
    }
}

export async function sendWhatsAppConfirmation(data: {
    guestName: string;
    boatCode: string;
    bookingId: string;
    tripDate: string;
    cruiseType: string;
    boardingPoint: string;
    totalAmount: number;
    advance: number;
    balance: number;
    phoneNumber: string;
}) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || 'whatsapp:+14155238886';

    // Format the date to DD/MM/YYYY
    const date = new Date(data.tripDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Clean phone number: remove any non-digit characters (like + or -)
    const cleanPhone = data.phoneNumber.replace(/\D/g, '');

    // Template params in order matching {{1}} to {{9}} for booking_confirmation
    const contentVariables = JSON.stringify({
        "1": data.guestName,
        "2": data.boatCode,
        "3": data.bookingId,
        "4": formattedDate,
        "5": data.cruiseType,
        "6": data.boardingPoint,
        "7": data.totalAmount.toString(),
        "8": data.advance.toString(),
        "9": data.balance.toString()
    });

    try {
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            contentSid: 'HX48a84d9fd42d42411ee6d612dd210fdb',
            from: fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`,
            to: `whatsapp:+${cleanPhone}`,
            contentVariables: contentVariables
        });

        console.log("Twilio Response SID:", message.sid);
        return { success: true, message: "WhatsApp message sent successfully." };
    } catch (error) {
        console.error("WhatsApp Send Error:", error);
        return { success: false, message: "Internal server error while sending WhatsApp message." };
    }
}

//ai sensy implimentation is commented out for reference, but we are now using Twilio for sending WhatsApp messages as per the latest requirements.
// 'use server'

// export async function sendOwnerWhatsAppConfirmation(data: {
//     boatName: string;
//     tripDate: string;
//     cruiseType: string;
//     bookingId: string;
//     guestName: string;
//     guestPlace: string;
//     totalAmount: number;
//     advance: number;
//     balance: number;
//     ownerPhoneNumber: string;
// }) {
//     const apiKey = process.env.AISENSY_API_KEY;
//     const campaignName = "Owner_Booking_Confirmation";

//     // Format the date to DD/MM/YYYY
//     const date = new Date(data.tripDate);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const formattedDate = `${day}/${month}/${year}`;

//     // Clean phone number: remove any non-digit characters (like + or -)
//     const cleanPhone = data.ownerPhoneNumber.replace(/\D/g, '');

//     // Template params in order:
//     // {{1}} boatName, {{2}} tripDate, {{3}} cruiseType, {{4}} bookingId,
//     // {{5}} guestName, {{6}} place, {{7}} total, {{8}} advance, {{9}} balance
//     const templateParams = [
//         data.boatName,
//         formattedDate,
//         data.cruiseType,
//         data.bookingId,
//         data.guestName,
//         data.guestPlace,
//         data.totalAmount.toString(),
//         data.advance.toString(),
//         data.balance.toString(),
//     ];

//     const payload = {
//         apiKey: apiKey,
//         campaignName: campaignName,
//         destination: cleanPhone,
//         userName: "Owner",
//         templateParams: templateParams,
//         source: "api",
//         media: {}
//     };

//     try {
//         const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         });

//         const result = await response.json();
//         console.log("AiSensy Owner Response:", result);

//         if (result.success || result.status === "success") {
//             return { success: true, message: "Owner WhatsApp message sent successfully." };
//         } else {
//             console.error("AiSensy Owner Error:", result);
//             return { success: false, message: result.message || "Failed to send owner WhatsApp message." };
//         }
//     } catch (error) {
//         console.error("Owner WhatsApp Send Error:", error);
//         return { success: false, message: "Internal server error while sending owner WhatsApp message." };
//     }
// }

// export async function sendWhatsAppConfirmation(data: {
//     guestName: string;
//     boatCode: string;
//     bookingId: string;
//     tripDate: string;
//     cruiseType: string;
//     boardingPoint: string;
//     totalAmount: number;
//     advance: number;
//     balance: number;
//     phoneNumber: string;
// }) {
//     const apiKey = process.env.AISENSY_API_KEY;
//     const campaignName = "Booking_confirmation-1";
//     const templateName = "booking_confirmation_1";

//     // Format the date to DD-MM-YYYY
//     const date = new Date(data.tripDate);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const formattedDate = `${day}/${month}/${year}`;

//     // Clean phone number: remove any non-digit characters (like + or -)
//     const cleanPhone = data.phoneNumber.replace(/\D/g, '');

//     // Prepare template params in order: 
//     // guestName, boatcode, bookingid, tripdate, cruisetype, boardingpoint, totalamount, advance, balance
//     const templateParams = [
//         data.guestName,
//         data.boatCode,
//         data.bookingId,
//         formattedDate,
//         data.cruiseType,
//         data.boardingPoint,
//         data.totalAmount.toString(),
//         data.advance.toString(),
//         data.balance.toString()
//     ];

//     const payload = {
//         apiKey: apiKey,
//         campaignName: campaignName,
//         destination: cleanPhone,
//         userName: data.guestName,
//         templateParams: templateParams,
//         source: "api",
//         media: {}
//     };

//     try {
//         const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         });

//         const result = await response.json();
//         console.log("AiSensy Response:", result);

//         if (result.success || result.status === "success") {
//             return { success: true, message: "WhatsApp message sent successfully." };
//         } else {
//             console.error("AiSensy Error:", result);
//             return { success: false, message: result.message || "Failed to send WhatsApp message." };
//         }
//     } catch (error) {
//         console.error("WhatsApp Send Error:", error);
//         return { success: false, message: "Internal server error while sending WhatsApp message." };
//     }
// }
