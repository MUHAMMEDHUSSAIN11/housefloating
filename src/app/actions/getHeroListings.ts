import { collection, getDocs, limit, query, orderBy } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

export interface HeroListing {
  id: string;
  category: string;
  image: string;
  price: number;
  title: string;
  dayCruisePrice: number;
}

export default async function GetHeroListings(): Promise<HeroListing[]> {
  try {
    const listingRef = collection(firestore, "Boats");
    // Order by dayCruisePrice in ascending order (lowest first) and limit to 8 documents
    const limitedQuery = query(
      listingRef, 
      orderBy("dayCruisePrice", "asc"), 
      limit(8)
    );
    const listingsQueryData = await getDocs(limitedQuery);
    const listings = listingsQueryData.docs.map((doc) => {
      const data = doc.data();
     
      return {
        id: doc.id,
        category: data.category || '',
        image: data.images[0] || [],
        price: data.price || 0,
        title: data.guestTitle || '',
        dayCruisePrice: data.dayCruisePrice || 0,
      } as HeroListing;
    });
    return listings;
   
  } catch (error) {
    console.log(error);
    return [];
  }
}