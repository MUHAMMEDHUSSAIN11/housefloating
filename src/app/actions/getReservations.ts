import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';

const getReservations = async () => {
  try {
    const ReservationRef = collection(firestore, "Reservations");
    const q = query(ReservationRef, orderBy("CreatedOn", "desc"));
    const ReservationData = await getDocs(q);
    return ReservationData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getReservations;