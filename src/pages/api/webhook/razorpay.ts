import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlinePayment from '@/app/actions/OnlinePayments/HandleCreateOnlinePayment';
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

        const paymentData = {
            advanceAmount: paymentEntity.amount / 100, // Razorpay amount is in paise
            onlineBookingId: Number(metadata.onlineBookingId),
            paymentModeId: paymentModeId,
            remainingAmount: Number(metadata.remainingAmount),
            totalPrice: Number(metadata.totalPrice),
            transactionId: paymentEntity.id
        };

        try {
            const token = metadata.authToken; // Get token passed from frontend
            console.log('Webhook calling HandleCreateOnlinePayment with token:', token ? 'Bearer Present' : 'NONE');
            await HandleCreateOnlinePayment(paymentData, token);
            return res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Error processing consolidated booking/payment webhook:', error);
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
