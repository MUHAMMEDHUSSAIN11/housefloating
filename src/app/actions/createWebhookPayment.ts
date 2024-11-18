import { adminDb } from '../firebase/adminClientApp';
import { Timestamp } from "firebase-admin/firestore";
import Stripe from "stripe";

export interface paymentModel extends Record<string, any> {
    ReservationId: string | undefined;
    BoatId: string | undefined;
    PaidDate: Timestamp;
    PaymentStatus: Stripe.PaymentIntent.Status;
    AmountPaidInRupees: number;
    UserEmail: string | undefined;
    UserId: string | undefined;
    RemainingAmount: string | undefined;
  }

export default async function createPayment(paymentDetails: paymentModel) {
    try {
        const paymentRef = await adminDb.collection("Payments").add(paymentDetails);
        return paymentRef.id;
    } catch (error) {
        console.error("Error creating payment:", error);
    }
}
