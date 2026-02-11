import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';
import HandleDeleteOnlineBooking from '@/app/actions/OnlineBookings/HandleDeleteOnlineBooking';
import { PaymentModes } from '@/app/enums/enums';
import { sendAllEmails } from '@/app/actions/Emailsender/emailsender';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    console.log('🚀 Razorpay Webhook Process Started');

    try {
        // 2. Obtain the Raw Body buffer
        const rawBody = await getRawBody(req);
        const signature = req.headers['x-razorpay-signature'] as string;

        if (!webhookSecret) {
            console.error('❌ Webhook Error: RAZORPAY_WEBHOOK_SECRET missing in environment');
            return res.status(500).send('Configuration error');
        }

        // 3. Verify Signature using the Raw Body
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Webhook Error: Invalid Signature Mismatch');
            return res.status(400).send('Invalid signature');
        }

        // 4. Parse the body manually since bodyParser is disabled
        const body = JSON.parse(rawBody.toString());
        const { event, payload } = body;
        console.log(`✅ Event Received: ${event}`);

        if (event === 'payment.captured') {
            const paymentEntity = payload.payment.entity;
            const metadata = paymentEntity.notes || {};

            const onlineBookingId = Number(metadata.onlineBookingId);
            const token = metadata.at;

            let paymentModeId = PaymentModes.UPI;
            if (paymentEntity.method === 'card') paymentModeId = PaymentModes.Card;
            else if (paymentEntity.method === 'netbanking') paymentModeId = PaymentModes.NetBanking;

            // 5. Payment Data for Backend Save
            const paymentData = {
                advanceAmount: paymentEntity.amount / 100,
                onlineBookingId: onlineBookingId,
                paymentModeId: paymentModeId,
                remainingAmount: Number(metadata.remainingAmount || 0),
                totalPrice: Number(metadata.totalPrice || 0),
                transactionId: paymentEntity.id
            };

            // 6. Save Payment to Backend First
            try {
                console.log(`💾 Saving payment for booking #${onlineBookingId}`);
                await HandleCreateOnlinePayment(paymentData, token);
            } catch (err: any) {
                // If it fails with 409 or similar, it might be already processed
                console.warn('⚠️ Payment save note:', err?.message || err);
            }

            const emailChunks = (metadata.ed1 || '') + (metadata.ed2 || '') + (metadata.ed3 || '');
            if (emailChunks) {
                try {
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
                        };
                    }
                    console.log(`📧 Sending emails for booking #${onlineBookingId}`);
                    // Trigger emails and wait for them - This is now the last major step
                    await sendAllEmails(parsed);
                } catch (err) {
                    console.error('❌ Email Error:', err);
                }
            }

            return res.status(200).json({ status: 'ok' });
        }

        if (event === 'payment.failed') {
            const metadata = payload.payment.entity.notes || {};
            const bookingId = Number(metadata.onlineBookingId);
            if (bookingId) {
                console.log(`🗑️ Cleaning failed booking #${bookingId}`);
                await HandleDeleteOnlineBooking({ bookingId }, metadata.at).catch(e => console.error('❌ Failed to delete:', e));
            }
            return res.status(200).json({ status: 'ok' });
        }

        res.status(200).json({ status: 'ignored' });

    } catch (err: any) {
        console.error('❌ Global Webhook Error:', err?.message || err);
        return res.status(500).send('Internal Server Error');
    }
}
