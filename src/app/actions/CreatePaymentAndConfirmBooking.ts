import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from '../firebase/adminClientApp';
import Stripe from "stripe";
import { BookingStatus } from "../enums/enums";

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

export const CreatePaymentAndConfirmBooking = async ( reservationId: string, paymentDetails: paymentModel ) => 
    {
        const reservationRef = adminDb.collection('Reservations').doc(reservationId);
    try {
        console.log("Started getting adminDb", reservationRef);
        console.log("AdminDB",adminDb);
        // Run Firestore transaction
        await adminDb.runTransaction(async (transaction) => {
            console.log("InsideTransaction",transaction);

            // Add payment details to "Payments" collection
            const paymentRef = adminDb.collection("Payments").doc();
            transaction.set(paymentRef, paymentDetails);

            // Update reservation status and payment status
            transaction.update(reservationRef, {
                Status: BookingStatus.Confirmed,
                Payment: true,
            });
        });

        console.log("dbcall executed");
    } catch (error) {
        console.log(error);
      
    }
};
