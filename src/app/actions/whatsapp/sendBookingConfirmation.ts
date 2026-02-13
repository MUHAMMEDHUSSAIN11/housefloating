'use server'

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
    const campaignName = "Booking_confirmation";
    const templateName = "booking_confirmation";

    // Format the date to DD-MM-YYYY
    const date = new Date(data.tripDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

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
        source: "api"
    };

    console.log("------------------------------------------");
    console.log("🚀 AISENSY WHATSAPP TRIGGER");
    console.log("------------------------------------------");
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("------------------------------------------");

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
