import { collection, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { BookingStatus } from "../enums/enums";
import { toast } from "sonner";

export default async function ConfirmAfterPayment(reservationId:string) {
    try {
        // Query the Reservations collection to find the document with matching BoatId and BookingDate
        const reservationRef = doc(collection(firestore, "Reservations"), reservationId);
        // If a matching document is found, update its  payment Status to 'true' and booking Status to confirmed.
        if (reservationRef) {
            await updateDoc(reservationRef, {
                Status: BookingStatus.Confirmed,
                Payment: true,
            });
            toast.success("Booking Status Updated to Approved.");
        } else {
            toast.error("No matching document found.");
        }
    } catch (error) {
        toast.error("Failed to update status to Paid.");
    }
}