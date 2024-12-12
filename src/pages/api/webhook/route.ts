import { buffer } from 'micro';
import Cors from 'micro-cors';
import { stripe } from "@/lib/Stripe";
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import SendPaymentTelegram from '@/app/actions/SendPaymentTelegram';
import SendFailedPaymentTelegram from '@/app/actions/SendFailedPaymentTelegram';
import { CreatePaymentAndConfirmBooking, paymentModel } from '@/app/actions/CreatePaymentAndConfirmBooking';
import { Timestamp } from 'firebase-admin/firestore';

const webhookSecret: string = process.env.webhookVercel!;

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
        const reservationId = session.metadata?.reservationId;
        const boatId = session.metadata?.boatId;
        const bookingDate = session.metadata?.bookingDate;
        const userEmail = session.metadata?.userEmail;
        const userId = session.metadata?.userId;
        const contactNumber = session.metadata?.contactNumber;
        const boatName = session.metadata?.boatName;

        // Cast event data to Stripe object.
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const paymentStatus = paymentIntent.status;
            const amountPaidInRupees = paymentIntent.amount / 100;

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
            res.status(200).json({ received: true });
            console.log("Started Calling Payment and confirm Booking");
            await processBookingAndNotification(reservationId, boatId, bookingDate, userEmail, payment,contactNumber,boatName);
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await SendFailedPaymentTelegram(reservationId, boatId,boatName ,bookingDate, userEmail, paymentIntent.last_payment_error?.message,contactNumber);
            console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    } else {
        res.status(405).end('Method Not Allowed');
    }
};

export default cors(webhookHandler as any);


async function processBookingAndNotification(reservationId : any, boatId : any, bookingDate : any, userEmail : any, payment : any, contactNumber: any, boatName : any) {
    try {
        console.log('Updating database...');
        // await CreatePaymentAndConfirmBooking(reservationId, payment);
        // console.log('Database update successful', reservationId,payment);
        console.log('Sending Telegram notification...');
        await SendPaymentTelegram(reservationId, boatId,boatName ,bookingDate, userEmail, contactNumber );
        console.log('Telegram message sent');
    } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError);
    }
}