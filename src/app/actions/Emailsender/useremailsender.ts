'use server'

import { sendMail } from "@/app/lib/mail/mailer";

export async function sendUserEmail(data: any) {
    const {
        guestEmail,
        boatCode,
        boatName,
        boatImage,
        bookingId,
        bookingType,
        boatCategory,
        boatRoomCount,
        cruiseType,
        tripDate,
        adultCount,
        childCount,
        totalPrice,
        advanceAmount,
        remainingAmount
    } = data;

    const subject = `Booking Confirmed! ${boatCode} (#${bookingId})`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333; line-height: 1.6;">
            <div style="background-color: #007bff; color: #ffffff; padding: 40px 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
                <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Get ready for your Housefloating adventure.</p>
            </div>
            
            <div style="padding: 30px;">
                <p style="font-size: 18px; margin-top: 0;">Hi there,</p>
                <p>Your booking for <strong>${boatCode}</strong> has been successfully confirmed. We've reserved your spot for a memorable trip.</p>
                
                <div style="display: flex; gap: 20px; align-items: center; background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0;">
                    ${boatImage ? `<img src="${boatImage}" alt="${boatCode}" style="width: 140px; height: 90px; object-fit: cover; border-radius: 8px;">` : ''}
                    <div>
                        <h3 style="margin: 0; color: #007bff; font-size: 18px;">${boatCode}, ${boatCategory}${bookingType === 'Private' ? `, ${boatRoomCount} Rooms` : ''}, ${bookingType}</h3>
                        <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Booking ID: <strong>#${bookingId}</strong></p>
                        <p style="margin: 2px 0 0; color: #666; font-size: 14px;">Boat Code: <strong>${boatCode}</strong></p>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-bottom: 15px;">Trip Overview</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #6c757d;">Trip Date</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${new Date(tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6c757d;">Cruise Type</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${cruiseType}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6c757d;">Adult Count</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${adultCount}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6c757d;">Child Count</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${childCount}</td></tr>
                        <tr><td style="padding: 15px 0 8px; color: #6c757d; font-size: 18px;">Total Price</td><td style="padding: 15px 0 8px; text-align: right; font-weight: 700; color: #28a745; font-size: 20px;">₹${totalPrice}</td></tr>
                    </table>
                </div>

                <div style="background-color: #e9f7ef; border-left: 4px solid #28a745; padding: 20px; border-radius: 4px; margin-top: 20px;">
                    <h4 style="margin: 0 0 10px; color: #155724;">Payment Summary</h4>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Advance Paid:</strong> ₹${advanceAmount}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Balance Due:</strong> ₹${remainingAmount}</p>
                    <p style="margin: 10px 0 0; font-size: 12px; font-style: italic; color: #666;">Note: The balance amount must be paid at the boat before check-in.</p>
                </div>

                <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                    <p style="color: #6c757d; font-size: 14px;">If you have any questions, please contact our support team.</p>
                    <p style="margin-top: 15px; font-weight: 600; color: #333;">Team Housefloating</p>
                </div>
            </div>
        </div>
    `;

    return sendMail(guestEmail, subject, html);
}