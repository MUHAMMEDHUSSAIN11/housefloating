import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
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


export default async function CreatePayment(paymentDetails: paymentModel) {
  // Return the DocumentReference for the created boat
  return await addDoc(collection(firestore, "Payments"), paymentDetails);
}