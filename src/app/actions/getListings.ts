import { Timestamp, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';

export interface Listing {
  category: string,
  bathroomCount: number,
  guestCount: number,
  images: string[],
  maxDayGuest: number,
  maxNightGuest: number,
  minDayGuest: number,
  minNightGuest: number,
  price: number,
  reservations: any[],
  roomCount: number,
  title: string,
  id: string,
  docId: string,
  guestTitle: string,
  dayCruisePrice: number,
  adultAddonPrice: number,
  childAddonPrice: number,
  dayAdultAddOnPrice: number,
  dayChildAddOnPrice: number,
}

export default async function getListings(): Promise<Listing[]> {
  try {
    const listingRef = collection(firestore, "Boats");
    const limitedQuery = query(listingRef,orderBy("dayCruisePrice", "asc"));
    const listingsQueryData = await getDocs(limitedQuery);

    const listings = listingsQueryData.docs.map((doc) => {
      const data = doc.data() as Listing;
      // Convert Firestore Timestamp objects to plain JavaScript objects for specific fields
      const reservations = data.reservations.map((timestamp: Timestamp) => ({
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
      }));

      // Spread data first, then add docId and reservations to ensure they're not overwritten
      return { ...data, docId: doc.id, reservations };
    });
    return listings;
  } catch (error) {
    console.log(error);
    return [];
  }
}