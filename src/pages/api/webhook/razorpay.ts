import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';

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
        const remainingAmount = metadata.remainingAmount;
        const totalPrice = metadata.totalPrice;

        const paymentData = {
            advanceAmount: paymentEntity.amount / 100,
            bookingId: Number(reservationId),
            paymentModeId: 1, // Online/Razorpay
            paymentStatusId: 2, // Paid/Captured
            remainingAmount: Number(remainingAmount),
            totalPrice: Number(totalPrice),
            transactionId: paymentEntity.id,
        };

        try {
            await HandleCreateOnlinePayment(paymentData);
            return res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Error processing booking payment:', error);
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

        return res.status(200).json({ status: 'ok' });
    }

    res.status(200).json({ status: 'ignored' });
}
