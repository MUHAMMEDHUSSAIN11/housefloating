
import { firestore } from "../firebase/clientApp";
import { collection, doc, updateDoc } from "firebase/firestore";
import { BookingStatus } from "../enums/enums";
import toast from "react-hot-toast";

export default async function UpdateStatusToApprovedID(ReservationId: string) {
    try {
        // Query the Reservations collection to find the document with matching BoatId and BookingDate
        const reservationRef = doc(collection(firestore, "Reservations"), ReservationId);
        // If a matching document is found, update its Status to "Paid"
        if (reservationRef) {
            await updateDoc(reservationRef, {
                Status: BookingStatus.Approved,
            });
            toast.success("Booking Status Updated to Approved.");
        } else {
            toast.error("No matching document found.");
        }
    } catch (error) {
        toast.error("Failed to update status to Paid.");
    }
}
