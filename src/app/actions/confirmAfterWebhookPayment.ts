import { BookingStatus } from "../enums/enums";
import { adminDb } from "../firebase/adminClientApp";

export default async function ConfirmAfterPayment(reservationId: string) {
    try {
        // Reference to the specific reservation document
        const reservationRef = adminDb.collection('Reservations').doc(reservationId);
        await reservationRef.update({
            Status: BookingStatus.Confirmed,
            Payment: true,
        });
    } catch (error) {
        console.error("Failed to confirm payment:", error);
    }
}