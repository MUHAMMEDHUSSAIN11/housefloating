'use server'

import { sendMail } from "@/app/lib/mail/mailer";

export async function sendOwnerEmail(data: any) {
    const {
        ownerEmail,
        boatName,
        boatImage,
        bookingDate,
        bookingId,
        cruiseType,
        boatCategory,
        boatRoomCount,
        bookingType,
        adultCount,
        childCount,
        tripDate,
        guestName,
        guestPlace,
        totalPrice,
        advanceAmount,
        remainingAmount
    } = data;

    const subject = `New Boat Booking - ${boatName} (#${bookingId})`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
            <div style="background-color: #000000; color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Housefloating</h1>
                <p style="margin: 5px 0 0; opacity: 0.7; font-size: 14px;">Official Booking Confirmation</p>
            </div>
            
            <div style="padding: 24px;">
                <p style="font-size: 16px;">Hello Owner,</p>
                
                <div style="font-size: 1.1em; line-height: 1.6; margin: 20px 0; color: #1a1a1a;">
                    Your boat <strong>${boatName}</strong> on <strong>${new Date(tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong> for <strong>${cruiseType}</strong> with <strong>${guestName}</strong> from ${guestPlace} has been booked. 
                </div>

                <div style="display: flex; gap: 20px; align-items: flex-start; background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 24px;">
                    ${boatImage ? `<img src="${boatImage}" alt="${boatName}" style="width: 140px; height: 90px; object-fit: cover; border-radius: 6px;">` : ''}
                    <div>
                        <h3 style="margin: 0; color: #333; font-size: 18px;">${boatName}, ${boatCategory}${bookingType === 'Private' ? `, ${boatRoomCount} Rooms` : ''}, ${bookingType}</h3>
                        <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Booking ID: <strong>#${bookingId}</strong></p>
                    </div>
                </div>
                
                <div style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                    <h3 style="margin: 0; padding: 12px 20px; background: #f8f9fa; color: #555; font-size: 15px;">Trip Overview</h3>
                    <div style="padding: 15px 20px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 6px 0; color: #777;">Trip Date</td><td style="padding: 6px 0; font-weight: 500;">${new Date(tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
                            <tr><td style="padding: 6px 0; color: #777;">Booking Date</td><td style="padding: 6px 0; font-weight: 500;">${new Date(bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td></tr>
                            <tr><td style="padding: 6px 0; color: #777;">Cruise Type</td><td style="padding: 6px 0; font-weight: 500;">${cruiseType}</td></tr>
                            <tr><td style="padding: 6px 0; color: #777;">Adult Count</td><td style="padding: 6px 0; font-weight: 500;">${adultCount}</td></tr>
                            <tr><td style="padding: 6px 0; color: #777;">Child Count</td><td style="padding: 6px 0; font-weight: 500;">${childCount}</td></tr>
                        </table>
                    </div>
                </div>

                <div style="border: 2px solid #28a745; padding: 20px; border-radius: 8px; background-color: #f6fffa;">
                    <h3 style="margin: 0 0 15px; color: #28a745; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Payment Information</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 15px;">
                        <tr>
                            <td style="padding: 6px 0; color: #155724;">Total Amount</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #155724; font-size: 18px;">₹${totalPrice}</td>
                        </tr>
                        <tr style="border-top: 1px dashed #28a745;">
                            <td style="padding: 6px 0; color: #333;">Advance (30%)</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #333;">₹${advanceAmount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #333;">Remaining</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #333;">₹${remainingAmount}</td>
                        </tr>
                    </table>
                    <p style="margin: 8px 0; font-size: 15px; font-weight: bold; color: #155724;">This booking Housefloating confirm.</p>
                    <p style="margin: 8px 0; font-size: 14px; color: #333;">Advance 30% (₹${advanceAmount}) already taken by Housefloating.</p>
                    <p style="margin: 8px 0; font-size: 14px; color: #333;">Remaining amount (₹${remainingAmount}) guest paid before check in.</p>
                </div>

                <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                    This is an automated notification from Housefloating.
                </p>
            </div>
        </div>
    `;

    return sendMail(ownerEmail, subject, html);
}