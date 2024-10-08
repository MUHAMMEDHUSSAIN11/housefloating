import { Timestamp, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';

interface Listing {
  category: string,
  bathroomCount: number,
  guestCount: number,
  images: string[],
  maxDayGuest: number,
  maxNightGuest: number,
  price: number,
  reservations: any[],
  roomCount: number,
  title: string,
}

export default async function getListings(): Promise<Listing[]> {
  try {
    // const listingRef = collection(firestore, "Boats");
    // const listingsQueryData = await getDocs(listingRef);

    const listingRef = collection(firestore, "Boats");
    // Order the listings by price in increasing order
    const listingsQuery = query(listingRef, orderBy("price", "asc"));
    const listingsQueryData = await getDocs(listingsQuery);
    

    const listings = listingsQueryData.docs.map((doc) => {
      const data = doc.data() as Listing;
      // Convert Firestore Timestamp objects to plain JavaScript objects for specific fields
      const reservations = data.reservations.map((timestamp: Timestamp) => ({
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      }));
      
      return { id: doc.id, ...data, reservations };
    });
    return listings;
  } catch (error) {
    console.log(error);
    return [];
  }
}
