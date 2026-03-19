import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';
import HandleDeleteOnlineBooking from '@/app/actions/OnlineBookings/HandleDeleteOnlineBooking';
import { PaymentModes } from '@/app/enums/enums';
import { sendAllEmails } from '@/app/actions/Emailsender/emailsender';
import { sendWhatsAppConfirmation, sendOwnerWhatsAppConfirmation } from '@/app/actions/whatsapp/sendBookingConfirmation';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper function to read the raw body from the request stream
async function getRawBody(req: NextApiRequest) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

const processedPaymentIds = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const rawBody = await getRawBody(req);
        const signature = req.headers['x-razorpay-signature'] as string;

        if (!webhookSecret) {
            console.error('❌ Webhook Error: RAZORPAY_WEBHOOK_SECRET missing');
            return res.status(500).send('Configuration error');
        }

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Webhook Error: Invalid Signature');
            return res.status(400).send('Invalid signature');
        }

        const body = JSON.parse(rawBody.toString());
        const { event, payload } = body;
        const paymentId = payload.payment.entity.id;

        // If we already started processing this payment in the last 10 minutes, stop here.
        if (processedPaymentIds.has(paymentId)) {
            console.log(`🔒 Payment ${paymentId} is already being processed or finished. Skipping duplicate.`);
            return res.status(200).json({ status: 'locked', message: 'Already processed' });
        }

        processedPaymentIds.add(paymentId);
        // Safety: remove from lock after 10 minutes to prevent memory leaks
        setTimeout(() => processedPaymentIds.delete(paymentId), 10 * 60 * 1000);

        console.log(`✅ Processing Event: ${event} for Payment ${paymentId}`);

        if (event === 'payment.captured') {
            const paymentEntity = payload.payment.entity;
            const metadata = paymentEntity.notes || {};
            const onlineBookingId = Number(metadata.onlineBookingId);
            const token = metadata.at;

            console.log(`📝 Metadata Keys Found: ${Object.keys(metadata).join(', ')}`);

            let paymentModeId = PaymentModes.UPI;
            if (paymentEntity.method === 'card') paymentModeId = PaymentModes.Card;
            else if (paymentEntity.method === 'netbanking') paymentModeId = PaymentModes.NetBanking;

            const paymentData = {
                advanceAmount: paymentEntity.amount / 100,
                onlineBookingId: onlineBookingId,
                paymentModeId: paymentModeId,
                remainingAmount: Number(metadata.remainingAmount || 0),
                totalPrice: Number(metadata.totalPrice || 0),
                transactionId: paymentEntity.id
            };

            try {
                console.log(`💾 Saving payment for booking #${onlineBookingId}`);
                await HandleCreateOnlinePayment(paymentData, token).catch(e => console.warn('⚠️ DB Save Note:', e.message));

                const emailChunks = (metadata.ed1 || '') + (metadata.ed2 || '') + (metadata.ed3 || '') + (metadata.ed4 || '');
                console.log(`📦 Combined Metadata Length: ${emailChunks.length} characters`);

                if (emailChunks) {
                    let parsed;
                    try {
                        parsed = JSON.parse(emailChunks);
                    } catch (jsonErr) {
                        console.error('❌ Metadata JSON Parse Error:', jsonErr);
                        console.log('Raw string that failed:', emailChunks);
                    }

                    if (parsed && parsed.bc) {
                        const bookingData = {
                            boatCode: parsed.bc, boatName: parsed.bn, boatCategory: parsed.bCat,
                            boatRoomCount: parsed.brc, boatImage: parsed.bi, bookingType: parsed.bt,
                            bookingDate: parsed.bd, bookingId: parsed.bid, adultCount: parsed.ac,
                            cruiseType: parsed.ct, tripDate: parsed.td, roomCount: parsed.rc,
                            guestName: parsed.gn, guestPlace: parsed.gp, guestPhone: parsed.gph,
                            guestEmail: parsed.ge, ownerEmail: parsed.oe, ownerPhoneNumber: parsed.op,
                            totalPrice: parsed.tp,
                            advanceAmount: parsed.aa, remainingAmount: parsed.ra,
                            boardingPoint: parsed.bp
                        };

                        console.log(`📧 Sending emails for booking #${onlineBookingId}`);
                        await sendAllEmails(bookingData).catch(err => console.error('❌ Email Send Error:', err));

                        if (bookingData.guestPhone) {
                            console.log(`📱 Sending WhatsApp confirmation to ${bookingData.guestPhone}`);
                            await sendWhatsAppConfirmation({
                                guestName: bookingData.guestName,
                                boatCode: bookingData.boatCode,
                                bookingId: bookingData.bookingId.toString(),
                                tripDate: bookingData.tripDate,
                                cruiseType: bookingData.cruiseType,
                                boardingPoint: bookingData.boardingPoint,
                                totalAmount: bookingData.totalPrice,
                                advance: bookingData.advanceAmount,
                                balance: bookingData.remainingAmount,
                                phoneNumber: bookingData.guestPhone
                            }).catch((err: any) => console.error('❌ WhatsApp Send Error:', err));
                        }

                        if (bookingData.ownerPhoneNumber) {
                            console.log(`📱 Sending WhatsApp owner alert to ${bookingData.ownerPhoneNumber}`);
                            await sendOwnerWhatsAppConfirmation({
                                boatName: bookingData.boatName,
                                tripDate: bookingData.tripDate,
                                cruiseType: bookingData.cruiseType,
                                bookingId: bookingData.bookingId.toString(),
                                guestName: bookingData.guestName,
                                guestPlace: bookingData.guestPlace,
                                totalAmount: bookingData.totalPrice,
                                advance: bookingData.advanceAmount,
                                balance: bookingData.remainingAmount,
                                ownerPhoneNumber: bookingData.ownerPhoneNumber
                            }).catch((err: any) => console.error('❌ Owner WhatsApp Send Error:', err));
                        }
                    } else {
                        console.warn('⚠️ No valid booking data found in metadata chunks');
                    }
                } else {
                    console.warn(`⚠️ No metadata chunks found (ed1-ed4 empty) for payment ${paymentId}`);
                }
            } catch (innerError) {
                console.error('❌ Error during webhook processing:', innerError);
            }

            return res.status(200).json({ status: 'captured' });
        }

        if (event === 'payment.failed') {
            const metadata = payload.payment.entity.notes || {};
            const bookingId = Number(metadata.onlineBookingId);
            if (bookingId) {
                console.log(`🗑️ Cleaning failed booking #${bookingId}`);
                await HandleDeleteOnlineBooking({ bookingId }, metadata.at).catch(e => console.error('❌ Failed to delete:', e));
            }
            return res.status(200).json({ status: 'handled_failure' });
        }

        return res.status(200).json({ status: 'ignored_event' });

    } catch (err: any) {
        console.error('❌ Global Webhook Error:', err?.message || err);
        if (!res.headersSent) {
            return res.status(500).send('Internal Server Error');
        }
    }
}
