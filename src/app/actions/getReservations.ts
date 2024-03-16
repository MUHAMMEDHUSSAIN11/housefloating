import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';

export default async function getReservations() {
  try {
    const ReservationRef = collection(firestore, "Reservations");
    const ReservationData = await getDocs(ReservationRef);
    return ReservationData;
  } catch (error) {
    console.log(error);
    return null;
  }
}