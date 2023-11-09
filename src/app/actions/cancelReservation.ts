import { Timestamp, arrayRemove, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import toast from "react-hot-toast";
import { BookingStatus } from "../enums/enums";

interface BookingDetails {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BookingDate: Timestamp;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: string;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
};

export default async function CancelReservation(OrderDetails: BookingDetails) {
  try {

    const boatRef = doc(collection(firestore, 'Boats'), OrderDetails.BoatId);
    const getboat = await getDoc(boatRef);
    const reservations: Timestamp[] = getboat.data()?.reservations || [];


    const indexOfReservationToRemove = reservations.findIndex((reservation: Timestamp) => {
      const reservationDate = reservation.toDate();
      const bookingDate = OrderDetails.BookingDate.toDate();
      return reservationDate.getDate() === bookingDate.getDate() && reservationDate.getMonth() === bookingDate.getMonth() && reservationDate.getFullYear() === bookingDate.getFullYear();
    });

    console.log(indexOfReservationToRemove);

    if (indexOfReservationToRemove !== -1) {
      // Remove the reservation from the array
      reservations.splice(indexOfReservationToRemove, 1);
      await updateDoc(boatRef, { reservations });

      // Now, update the status of reservation document in the "Reservations" collection
      const reservationDocRef = doc(collection(firestore, 'Reservations'), OrderDetails.ReservationId);
      // Update the status field to "cancelled"
      await updateDoc(reservationDocRef, { Status: BookingStatus.Cancelled });

      const cancellationsRef = doc(collection(firestore, "Cancellations"),OrderDetails.ReservationId);
      await setDoc(cancellationsRef, {
        BoatID: OrderDetails.BoatId,
        BoatName: OrderDetails.BoatName,
        BookedDate: OrderDetails.BookingDate,
        ContactNumber: OrderDetails.Contactnumber,
        Email: OrderDetails.Email,
        GuestCount: OrderDetails.HeadCount + OrderDetails.MinorCount,
        Mode: OrderDetails.Mode,
        Payment: OrderDetails.Payment,
        Price: OrderDetails.Price,
        Refund:false,
      });
      toast.success("Reservation cancelled successfully.");

    } else {
      // Reservation not found, display an error message
      toast.error("Reservation not found.");
    }
  } catch (error) {
    // Handle errors gracefully
    console.error("Error canceling reservation:", error);
    toast.error("Error canceling reservation.");

  }
}

