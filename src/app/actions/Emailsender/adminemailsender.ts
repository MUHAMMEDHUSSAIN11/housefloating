'use server'

import { sendMail } from "@/app/lib/mail/mailer";

export async function sendAdminEmail(data: any, adminEmails: string[]) {
    const {
        boatCode,
        boatName,
        boatImage,
        bookingDate,
        bookingId,
        cruiseType,
        tripDate,
        guestName,
        guestPhone,
        totalPrice
    } = data;

    const subject = `New Booking Alert - ${boatCode} (#${bookingId})`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
            <div style="background-color: #1a1a1a; color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">Admin Notification</h1>
                <p style="margin: 8px 0 0; opacity: 0.8;">New Website Booking Received</p>
            </div>
            
            <div style="padding: 24px;">
                <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 24px;">
                    ${boatImage ? `<img src="${boatImage}" alt="${boatName}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">` : ''}
                    <div style="flex: 1;">
                        <h2 style="margin: 0 0 8px; color: #d9534f; font-size: 20px;">${boatName}</h2>
                        <p style="margin: 0; color: #666; font-size: 14px;">Code: <strong>${boatCode}</strong></p>
                        <p style="margin: 4px 0 0; color: #666; font-size: 14px;">Booking ID: <strong>#${bookingId}</strong></p>
                    </div>
                </div>

                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px; color: #555; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Trip Details</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr><td style="padding: 6px 0; color: #777;">Trip Date:</td><td style="padding: 6px 0; font-weight: 500;">${tripDate}</td></tr>
                        <tr><td style="padding: 6px 0; color: #777;">Cruise Type:</td><td style="padding: 6px 0; font-weight: 500;">${cruiseType}</td></tr>
                        <tr><td style="padding: 6px 0; color: #777;">Booking Date:</td><td style="padding: 6px 0; font-weight: 500;">${bookingDate}</td></tr>
                        <tr><td style="padding: 6px 0; color: #777;">Total Price:</td><td style="padding: 6px 0; font-weight: 600; color: #28a745;">₹${totalPrice}</td></tr>
                    </table>
                </div>

                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 12px; color: #555; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Guest Contacts</h3>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Name:</strong> ${guestName}</p>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Phone:</strong> ${guestPhone}</p>
                </div>
            </div>

            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                This is an automated admin alert from the Housefloating booking engine.
            </div>
        </div>
    `;

    return sendMail(adminEmails, subject, html);
}
