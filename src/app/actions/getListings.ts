import { Timestamp, collection, getDocs } from 'firebase/firestore'; 
import { firestore } from '../firebase/clientApp';

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
        ...data, // This includes all other fields from Firestore data
        reservations,
        // someOtherTimestampField, // Include other converted timestamp fields if needed
      };
    });
    return listings;
  } catch (error) {
    console.log(error);
    return null;
  }
}


//this is used before warning convert into plainobjects of seconds,nanoseconds
// export default async function getListings() {
//   try {
//     const listingRef = collection(firestore, "Boats");
//     const listingsQueryData = await getDocs(listingRef);  
//     const listings = listingsQueryData.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
