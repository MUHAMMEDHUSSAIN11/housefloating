import { Timestamp, collection, getDocs } from 'firebase/firestore'; 
import { firestore } from '../../../app/firebase/clientApp';


export default async function getListings() {
  try {
    const listingRef = collection(firestore, "Boats");
    const listingsQueryData = await getDocs(listingRef);

    const listings = listingsQueryData.docs.map((doc) => {
      const data = doc.data();
      // Convert Firestore Timestamp objects to plain JavaScript objects for specific fields
      const reservations = data.reservations.map((timestamp: Timestamp) => ({
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      }));
      return {
        id: doc.id,
        ...data, 
        reservations,
      };
    });
    return listings;
  } catch (error) {
    console.log(error);
    return null;
  }
}

