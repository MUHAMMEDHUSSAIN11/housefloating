import { buffer } from 'micro';
import Cors from 'micro-cors';
import { stripe } from "@/lib/Stripe";
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import ConfirmAfterPayment from '@/app/actions/ConfirmAfterPayment';
import SendPaymentTelegram from '@/app/actions/SendPaymentTelegram';
import createPayment, { paymentModel } from '@/app/actions/createPayment';
import { Timestamp } from 'firebase/firestore';

const webhookSecret: string = process.env.webhook!;

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false,
    },
};

const cors = Cors({
    allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const body = await buffer(req);
        const signature = req.headers['stripe-signature']!;

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body.toString(),
                signature,
                webhookSecret
            );
        } catch (error: any) {
            res.status(400).send(`Webhook Error: ${error.message}`);
            return;
        }
        const session = event.data.object as Stripe.Checkout.Session;
        // Cast event data to Stripe object.
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const reservationId = session.metadata?.reservationId;
            const boatId = session.metadata?.boatId;
            const paymentStatus = paymentIntent.status;
            const amountPaidInRupees = paymentIntent.amount / 100;
            const userEmail = session.metadata?.userEmail;
            const userId = session.metadata?.userId;
            const remainingAmount = session.metadata?.remainingAmount;
            const bookingDate = session.metadata?.bookingDate;

            const payment: paymentModel = {
                ReservationId: reservationId,
                BoatId: boatId,
                PaidDate: Timestamp.now(),
                PaymentStatus: paymentStatus,
                AmountPaidInRupees: amountPaidInRupees,
                UserEmail: userEmail,
                UserId: userId,
                RemainingAmount: remainingAmount,
            };
            if (reservationId && boatId) {
                try {
                    console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
                    await ConfirmAfterPayment(reservationId);
                    await createPayment(payment);
                    await SendPaymentTelegram(reservationId, boatId, bookingDate);
                } catch (error: any) {
                    res.status(400).send(`Status Update Error: ${error.message}`);
                    return;
                }
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default cors(webhookHandler as any);
