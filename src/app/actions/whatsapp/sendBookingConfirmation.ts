'use server'

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
    ownerPhone: string;
}) {
    const apiKey = process.env.AISENSY_API_KEY;
    const campaignName = "Owner_Booking_Confirmation";

    // Format the date to DD/MM/YYYY
    const date = new Date(data.tripDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Clean phone number: remove any non-digit characters (like + or -)
    const cleanPhone = data.ownerPhone.replace(/\D/g, '');

    // Template params in order:
    // {{1}} boatName, {{2}} tripDate, {{3}} cruiseType, {{4}} bookingId,
    // {{5}} guestName, {{6}} place, {{7}} total, {{8}} advance, {{9}} balance
    const templateParams = [
        data.boatName,
        formattedDate,
        data.cruiseType,
        data.bookingId,
        data.guestName,
        data.guestPlace,
        data.totalAmount.toString(),
        data.advance.toString(),
        data.balance.toString(),
    ];

    const payload = {
        apiKey: apiKey,
        campaignName: campaignName,
        destination: cleanPhone,
        userName: "Owner",
        templateParams: templateParams,
        source: "api",
        media: {}
    };

    try {
        const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("AiSensy Owner Response:", result);

        if (result.success || result.status === "success") {
            return { success: true, message: "Owner WhatsApp message sent successfully." };
        } else {
            console.error("AiSensy Owner Error:", result);
            return { success: false, message: result.message || "Failed to send owner WhatsApp message." };
        }
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
    const apiKey = process.env.AISENSY_API_KEY;
    const campaignName = "Booking_confirmation-1";
    const templateName = "booking_confirmation_1";

    // Format the date to DD-MM-YYYY
    const date = new Date(data.tripDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Clean phone number: remove any non-digit characters (like + or -)
    const cleanPhone = data.phoneNumber.replace(/\D/g, '');

    // Prepare template params in order: 
    // guestName, boatcode, bookingid, tripdate, cruisetype, boardingpoint, totalamount, advance, balance
    const templateParams = [
        data.guestName,
        data.boatCode,
        data.bookingId,
        formattedDate,
        data.cruiseType,
        data.boardingPoint,
        data.totalAmount.toString(),
        data.advance.toString(),
        data.balance.toString()
    ];

    const payload = {
        apiKey: apiKey,
        campaignName: campaignName,
        destination: cleanPhone,
        userName: data.guestName,
        templateParams: templateParams,
        source: "api",
        media: {}
    };

    try {
        const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("AiSensy Response:", result);

        if (result.success || result.status === "success") {
            return { success: true, message: "WhatsApp message sent successfully." };
        } else {
            console.error("AiSensy Error:", result);
            return { success: false, message: result.message || "Failed to send WhatsApp message." };
        }
    } catch (error) {
        console.error("WhatsApp Send Error:", error);
        return { success: false, message: "Internal server error while sending WhatsApp message." };
    }
}
