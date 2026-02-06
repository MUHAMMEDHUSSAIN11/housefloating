'use server'

import { sendMail } from "@/app/lib/mail/mailer";

export async function sendAdminEmail(data: any, adminEmails: string[]) {
    const {
        boatName,
        boatImage,
        bookingDate,
        bookingId,
        cruiseType,
        tripDate,
        guestName,
        guestPhone,
        adultCount,
        childCount,
        guestEmail,
        guestPlace,
        totalPrice,
        boatCategory,
        boatRoomCount,
        bookingType,
        advanceAmount,
        remainingAmount
    } = data;

    const subject = `🚢 New Booking Alert - ${boatName} (#${bookingId})`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #333;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🔔 New Booking Alert</h1>
                <p style="margin: 8px 0 0; opacity: 0.95; font-size: 14px;">Admin Notification - Housefloating</p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; margin: 0;">
                <p style="margin: 0; font-size: 14px; color: #856404;">
                    <strong>⚡ Action Required:</strong> A new booking has been received from Housefloating. Please review and process it.
                </p>
            </div>

            <div style="padding: 30px 24px;">
                <div style="display: flex; gap: 20px; align-items: flex-start; background: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef; margin-bottom: 25px;">
                    ${boatImage ? `<img src="${boatImage}" alt="${boatName}" style="width: 150px; height: 100px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">` : ''}
                    <div style="flex: 1;">
                        <h2 style="margin: 0 0 8px; color: #667eea; font-size: 20px;">${boatName}, ${boatCategory}${bookingType === 'Private' ? `, ${boatRoomCount} Rooms` : ''}, ${bookingType}</h2>
                        <p style="margin: 4px 0; color: #666; font-size: 14px;">Booking ID: <strong style="color: #333;">#${bookingId}</strong></p>
                        <span style="display: inline-block; margin-top: 8px; background-color: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">NEW BOOKING</span>
                    </div>
                </div>

                <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
                    <h3 style="margin: 0; padding: 14px 20px; background: #f8f9fa; color: #495057; font-size: 16px; border-bottom: 2px solid #667eea;">📅 Trip Information</h3>
                    <div style="padding: 18px 20px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d; width: 40%;">Trip Date</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${new Date(tripDate).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d;">Cruise Type</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${cruiseType}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d;">Adult Count</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${adultCount}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d;">Child Count</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${childCount}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #6c757d;">Booked On</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${new Date(bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
                    <h3 style="margin: 0; padding: 14px 20px; background: #f8f9fa; color: #495057; font-size: 16px; border-bottom: 2px solid #667eea;">👤 Guest Details</h3>
                    <div style="padding: 18px 20px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d; width: 40%;">Name</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${guestName}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d; width: 40%;">Place</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">${guestPlace}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 10px 0; color: #6c757d;">Phone</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">
                                    <a href="tel:${guestPhone}" style="color: #667eea; text-decoration: none;">${guestPhone}</a>
                                </td>
                            </tr>
                            ${guestEmail ? `<tr>
                                <td style="padding: 10px 0; color: #6c757d;">Email</td>
                                <td style="padding: 10px 0; font-weight: 600; color: #333;">
                                    <a href="mailto:${guestEmail}" style="color: #667eea; text-decoration: none;">${guestEmail}</a>
                                </td>
                            </tr>` : ''}
                        </table>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 2px solid #667eea; padding: 20px; border-radius: 10px;">
                    <h3 style="margin: 0 0 15px; color: #667eea; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">💰 Payment Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                        <tr>
                            <td style="padding: 8px 0; color: #495057;">Total Amount</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #333; font-size: 18px;">₹${totalPrice}</td>
                        </tr>
                        <tr style="border-top: 1px dashed #ddd;">
                            <td style="padding: 8px 0; color: #495057;">Advance Received (30%)</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #28a745;">₹${advanceAmount}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #495057;">Balance Pending</td>
                            <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #dc3545;">₹${remainingAmount}</td>
                        </tr>
                    </table>
                    <p style="margin: 15px 0 0; font-size: 12px; color: #6c757d; font-style: italic; padding-top: 10px; border-top: 1px solid #ddd;">
                        ℹ️ Balance amount to be collected at check-in
                    </p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #999;">
                        🤖 This is an automated admin notification from Housefloating booking system.
                    </p>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #999;">
                        Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    `;

    return sendMail(adminEmails, subject, html);
}