import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';
import HandleDeleteOnlineBooking from '@/app/actions/OnlineBookings/HandleDeleteOnlineBooking';
import { PaymentModes } from '@/app/enums/enums';
import { sendAllEmails } from '@/app/actions/Emailsender/emailsender';
import { sendWhatsAppConfirmation } from '@/app/actions/whatsapp/sendBookingConfirmation';

// 1. MUST disable body parsing for signature verification to work in Next.js
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

// In-memory lock to prevent multiple simultaneous webhooks from processing the same payment
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

        // 1. RESPOND IMMEDIATELY TO STOP RETRIES
        // Razorpay expects a 200 OK quickly. We send it now before doing any slow work.
        res.status(200).json({ status: 'accepted' });

        // 2. CHECK MEMORY LOCK
        // If we already started processing this payment in the last 10 minutes, stop here.
        if (processedPaymentIds.has(paymentId)) {
            console.log(`🔒 Payment ${paymentId} is already being processed or finished. Skipping duplicate.`);
            return;
        }

        // Add to lock
        processedPaymentIds.add(paymentId);
        // Safety: remove from lock after 10 minutes to prevent memory leaks
        setTimeout(() => processedPaymentIds.delete(paymentId), 10 * 60 * 1000);

        console.log(`✅ Processing Event: ${event} for Payment ${paymentId}`);

        if (event === 'payment.captured') {
            const paymentEntity = payload.payment.entity;
            const metadata = paymentEntity.notes || {};
            const onlineBookingId = Number(metadata.onlineBookingId);
            const token = metadata.at;

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

            // 3. BACKGROUND PROCESSING
            // We do not 'await' these because we already responded 200 OK.
            // This runs in the background of the server instance.
            (async () => {
                try {
                    console.log(`💾 Saving payment for booking #${onlineBookingId}`);
                    // Save to DB (HandleCreateOnlinePayment should have its own duplicate check too)
                    await HandleCreateOnlinePayment(paymentData, token).catch(e => console.warn('⚠️ DB Save Note:', e.message));

                    const emailChunks = (metadata.ed1 || '') + (metadata.ed2 || '') + (metadata.ed3 || '') + (metadata.ed4 || '');
                    if (emailChunks) {
                        let parsed = JSON.parse(emailChunks);
                        if (parsed.bc) {
                            parsed = {
                                boatCode: parsed.bc, boatName: parsed.bn, boatCategory: parsed.bCat,
                                boatRoomCount: parsed.brc, boatImage: parsed.bi, bookingType: parsed.bt,
                                bookingDate: parsed.bd, bookingId: parsed.bid, adultCount: parsed.ac,
                                cruiseType: parsed.ct, tripDate: parsed.td, roomCount: parsed.rc,
                                guestName: parsed.gn, guestPlace: parsed.gp, guestPhone: parsed.gph,
                                guestEmail: parsed.ge, ownerEmail: parsed.oe, totalPrice: parsed.tp,
                                advanceAmount: parsed.aa, remainingAmount: parsed.ra,
                                boardingPoint: parsed.bp
                            };
                        }
                        console.log(`📧 Sending emails for booking #${onlineBookingId}`);
                        await sendAllEmails(parsed);

                        if (parsed.guestPhone) {
                            console.log(`📱 Sending WhatsApp confirmation to ${parsed.guestPhone}`);
                            await sendWhatsAppConfirmation({
                                guestName: parsed.guestName,
                                boatCode: parsed.boatCode,
                                bookingId: parsed.bookingId.toString(),
                                tripDate: parsed.tripDate,
                                cruiseType: parsed.cruiseType,
                                boardingPoint: parsed.boardingPoint,
                                totalAmount: parsed.totalPrice,
                                advance: parsed.advanceAmount,
                                balance: parsed.remainingAmount,
                                phoneNumber: parsed.guestPhone
                            }).catch((err: any) => console.error('❌ WhatsApp Send Error:', err));
                        }
                    }
                } catch (bgError) {
                    console.error('❌ Background Webhook Error:', bgError);
                }
            })();

            return;
        }

        if (event === 'payment.failed') {
            const metadata = payload.payment.entity.notes || {};
            const bookingId = Number(metadata.onlineBookingId);
            if (bookingId) {
                console.log(`🗑️ Cleaning failed booking #${bookingId}`);
                HandleDeleteOnlineBooking({ bookingId }, metadata.at).catch(e => console.error('❌ Failed to delete:', e));
            }
            return;
        }

    } catch (err: any) {
        console.error('❌ Global Webhook Error:', err?.message || err);
        // We might have already sent a 200, so we can't send a 500 here if headers were sent
        if (!res.headersSent) {
            return res.status(500).send('Internal Server Error');
        }
    }
}
