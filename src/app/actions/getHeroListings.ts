import { collection, getDocs, limit, query } from "firebase/firestore";
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
    // Limit the query to only fetch 8 documents from Firebase
    const limitedQuery = query(listingRef, limit(8));
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

// // Transform Firebase data to component format
// export function TransformListingsToItems(listings: HeroListing[]): ListingItem[] {
//   return listings.map(listing => ({
//     id: listing.id,
//     title: listing.guestTitle,
//     price: `₹${listing.price.toLocaleString()}`, // Format price with Indian Rupee symbol and commas
//     image: listing.images[0], // Use first image
//     category: listing.category
//   }));
// }