import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import HandleCreateOnlineBooking from '@/app/actions/OnlineBookings/HandleCreateOnlineBooking';
import { PaymentModes } from '@/app/enums/enums';

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

        const onlineBookingData = {
            adultCount: Number(metadata.adultCount),
            boatId: Number(metadata.boatId),
            bookingDate: new Date().toISOString(),
            childCount: Number(metadata.childCount),
            contactNumber: metadata.contactNumber,
            cruiseTypeId: Number(metadata.cruiseTypeId),
            guestPlace: metadata.boardingPoint || '',
            guestUserId: Number(metadata.userId),
            isVeg: metadata.isVeg === 'true' || metadata.isVeg === true,
            price: Number(metadata.totalPrice),
            tripDate: metadata.tripDate,
            boardingPoint: metadata.boardingPoint || '',
            isSharing: metadata.isSharing === 'true' || metadata.isSharing === true,
            transactionId: paymentEntity.id,
            paymentModeId: paymentModeId,
            totalPrice: Number(metadata.totalPrice),
            advanceAmount: paymentEntity.amount / 100,
            remainingAmount: Number(metadata.remainingAmount),
        };

        try {
            await HandleCreateOnlineBooking(onlineBookingData);
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
