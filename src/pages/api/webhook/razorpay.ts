import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import SendPaymentTelegram from '@/app/actions/SendPaymentTelegram';
import SendFailedPaymentTelegram from '@/app/actions/SendFailedPaymentTelegram';
import { CreatePaymentAndConfirmBooking, paymentModel } from '@/app/actions/CreatePaymentAndConfirmBooking';
import { Timestamp } from 'firebase-admin/firestore';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_webhook_secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    if (event === 'payment.captured') {
        const paymentEntity = payload.payment.entity;
        const orderEntity = payload.order?.entity;

        // In Razorpay, notes often contain the metadata
        const metadata = paymentEntity.notes || {};

        const reservationId = metadata.reservationId;
        const boatId = metadata.boatId;
        const bookingDate = metadata.bookingDate;
        const userEmail = metadata.userEmail;
        const userId = metadata.userId;
        const contactNumber = metadata.contactNumber;
        const boatName = metadata.boatName;
        const remainingAmount = metadata.remainingAmount;

        const payment: paymentModel = {
            ReservationId: reservationId,
            BoatId: boatId,
            PaidDate: Timestamp.now(),
            PaymentStatus: 'succeeded',
            AmountPaidInRupees: paymentEntity.amount / 100,
            UserEmail: userEmail,
            UserId: userId,
            RemainingAmount: remainingAmount,
        };

        try {
            await CreatePaymentAndConfirmBooking(reservationId, payment);
            await SendPaymentTelegram(reservationId, boatId, boatName, bookingDate, userEmail, contactNumber);
            return res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Error processing booking:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    if (event === 'payment.failed') {
        const paymentEntity = payload.payment.entity;
        const metadata = paymentEntity.notes || {};

        const reservationId = metadata.reservationId;
        const boatId = metadata.boatId;
        const boatName = metadata.boatName;
        const bookingDate = metadata.bookingDate;
        const userEmail = metadata.userEmail;
        const contactNumber = metadata.contactNumber;

        await SendFailedPaymentTelegram(
            reservationId,
            boatId,
            boatName,
            bookingDate,
            userEmail,
            paymentEntity.error_description || 'Payment Failed',
            contactNumber
        );
        return res.status(200).json({ status: 'ok' });
    }

    res.status(200).json({ status: 'ignored' });
}
