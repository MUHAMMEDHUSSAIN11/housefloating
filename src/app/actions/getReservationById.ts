import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import toast from "react-hot-toast";

// Fetching reservations for a particular user.
type Reservation = {
  BoatId: string;
  BoatName: string;
  BookingDate: any;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: string;
  Payment: boolean;
  Category: string;
  Status: string;
};

const getReservationById = async (email: string | null) => {
  try {
    const reservationsRef = collection(firestore, "Reservations");

    // Create a query against the collection.
    const q = query(reservationsRef, where("Email", "==", email));

    // Fetch the documents that match the query.
    const querySnapshot = await getDocs(q);

    // Create an array of reservations of the defined type
    const reservations: Reservation[] = [];
    querySnapshot.forEach((doc) => {
      reservations.push(doc.data() as Reservation);
    });

    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    toast.error("Something went wrong while fetching reservations");
  }
};

export default getReservationById;
