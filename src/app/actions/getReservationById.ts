import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { toast } from "react-hot-toast";


// Fetching reservations for a particular user in cart page.
type Reservation = {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BookingDate: Timestamp;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: number;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
};

const getReservationById = async (email: string | null) => {
  try {
    const reservationsRef = collection(firestore, "Reservations");

    // Create a query against the collection.
    const q = query(reservationsRef, where("Email", "==", email));

    // Fetch the documents that match the query.
    const querySnapshot = await getDocs(q);

    const reservations: Reservation[] = [];
    querySnapshot.forEach((doc) => {
      const reservationData: any = doc.data();
      const reservationWithId: Reservation = { ReservationId: doc.id, ...reservationData };
      reservations.push(reservationWithId);
    });

    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    toast.error("Something went wrong while fetching reservations");
  }
};

export default getReservationById;
