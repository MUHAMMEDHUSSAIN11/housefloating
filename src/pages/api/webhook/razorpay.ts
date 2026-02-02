import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';
import HandleDeleteOnlineBooking from '@/app/actions/OnlineBookings/HandleDeleteOnlineBooking';
import { PaymentModes } from '@/app/enums/enums';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_webhook_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;
    console.log('Razorpay Webhook Received Event:', event);

    if (event === 'payment.captured') {
        const paymentEntity = payload.payment.entity;

        const metadata = paymentEntity.notes || {};

        let paymentModeId = PaymentModes.UPI; // Default to UPI
        if (paymentEntity.method === 'upi') {
            paymentModeId = PaymentModes.UPI;
        } else if (paymentEntity.method === 'card') {
            paymentModeId = PaymentModes.Card;
        } else if (paymentEntity.method === 'netbanking') {
            paymentModeId = PaymentModes.NetBanking;
        }

        // 1. Prepare Payment Data and metadata
        const paymentData = {
            advanceAmount: paymentEntity.amount / 100,
            onlineBookingId: Number(metadata.onlineBookingId),
            paymentModeId: paymentModeId,
            remainingAmount: Number(metadata.remainingAmount),
            totalPrice: Number(metadata.totalPrice),
            transactionId: paymentEntity.id
        };
        const token = metadata.at; // Use minified key 'at' for authToken from metadata
        console.log('Webhook: Using token beginning with:', token ? token.substring(0, 10) : 'NULL');

        // 2. Send Emails (Independent task)
        const ed1 = metadata.ed1 || '';
        const ed2 = metadata.ed2 || '';
        const ed3 = metadata.ed3 || '';
        const reconstructedDataRaw = ed1 + ed2 + ed3;

        if (reconstructedDataRaw) {
            try {
                // Determine if emailData needs parsing
                let parsed = JSON.parse(reconstructedDataRaw);

                // De-minify keys if necessary (check for 'bc' key)
                if (parsed.bc) {
                    parsed = {
                        boatCode: parsed.bc,
                        boatName: parsed.bn,
                        boatCategory: parsed.bCat,
                        boatRoomCount: parsed.brc,
                        boatImage: parsed.bi,
                        bookingType: parsed.bt,
                        bookingDate: parsed.bd,
                        bookingId: parsed.bid,
                        adultCount: parsed.ac,
                        childCount: parsed.cc,
                        cruiseType: parsed.ct,
                        tripDate: parsed.td,
                        guestName: parsed.gn,
                        guestPlace: parsed.gp,
                        guestPhone: parsed.gph,
                        guestEmail: parsed.ge,
                        ownerEmail: parsed.oe,
                        totalPrice: parsed.tp,
                        advanceAmount: parsed.aa,
                        remainingAmount: parsed.ra,
                    };
                }

                const { sendAllEmails } = require('@/app/actions/Emailsender/emailsender');
                console.log('Webhook: Sending background emails for booking:', paymentData.onlineBookingId);
                const emailResult = await sendAllEmails(parsed);
                console.log('Webhook: Email sending result:', JSON.stringify(emailResult, null, 2));
            } catch (emailError) {
                console.error('Webhook: Background Email Sending Failed (Metadata might be malformed):', emailError);
            }
        } else {
            console.warn('Webhook: No ed1/ed2/ed3 metadata found for booking:', paymentData.onlineBookingId);
        }

        // 3. Record Payment (might fail if frontend won the race)
        try {
            console.log('Webhook: Recording payment for booking:', paymentData.onlineBookingId);
            await HandleCreateOnlinePayment(paymentData, token);
            console.log('Webhook: Payment recorded successfully');
        } catch (error: any) {
            // Log as warning only, because it often means the frontend already finished this
            console.warn('Webhook: Payment recording skipped or failed (likely already recorded or session ended):', error?.message || error);
        }

        return res.status(200).json({ status: 'ok' });
    }

    if (event === 'payment.failed') {
        const paymentEntity = payload.payment.entity;
        const metadata = paymentEntity.notes || {};
        const bookingId = Number(metadata.onlineBookingId);
        const token = metadata.authToken;

        if (bookingId) {
            console.log('Payment failed for booking:', bookingId, '. Cleaning up...');
            try {
                await HandleDeleteOnlineBooking({ bookingId }, token);
            } catch (error) {
                console.error('Error deleting booking on payment failure:', error);
            }
        }

        return res.status(200).json({ status: 'ok' });
    }

    res.status(200).json({ status: 'ignored' });
}
