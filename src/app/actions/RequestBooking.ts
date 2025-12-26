import { Timestamp, addDoc, collection, doc, runTransaction } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import toast from "react-hot-toast";

interface Data {
    Contactnumber: any,
    BookingDate: Date,
    HeadCount: number,
    Price: number,
    Email: any,
    BoatId: string,
    BoatName: string,
    BoatTitle: string,
    MinorCount: number,
    Mode: string,
    Payment: boolean,
    Category: any,
    Status: any,
    Image: any,
    CreatedOn: Timestamp,
    CruiseType: string,
};

export default async function RequestBooking(reservationData: Data) {
    try {
        const reservationsCollection = collection(firestore, 'Reservations');

        await runTransaction(firestore, async (transaction) => {
            const boatDocRef = doc(firestore, 'Boats', reservationData.BoatId);

            // Get the current reservations array
            const boatDoc = await transaction.get(boatDocRef);
            const currentReservations = boatDoc.data()?.reservations || [];

            // Convert finalBookingDate to Firestore Timestamp
            const finalBookingTimestamp = new Timestamp(
                Math.floor(reservationData.BookingDate.getTime() / 1000), // Convert milliseconds to seconds
                0 // Nanoseconds
            );

            // Add the new bookingDate (as Timestamp) to the reservations array
            currentReservations.push(finalBookingTimestamp);

            // Update the "Reservations" array in the "Boats" collection
            transaction.update(boatDocRef, { reservations: currentReservations });

            // Add the reservation to the "Reservations" collection
            return await addDoc(reservationsCollection, reservationData);
        })
    } catch (error) {
        toast.error('something went wrong! Please contact our team');
    }
}

