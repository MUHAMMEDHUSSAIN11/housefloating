import { Timestamp, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';

export interface WishList {
  BoatId: string,
  BoatName: string,
  CreatedOn: string,
  Image: string,
  Price: number,
  UserEmail: string,
  UserId: string,
  dayCruisePrice: number, 
}

export default async function getWishlists(userId: string | undefined): Promise<WishList[]> {
  try {
    const listingRef = collection(firestore, "Wishlists");
    
    const listingsQuery = query(
                    listingRef,
                    where("UserId", "==", userId),
                    orderBy("CreatedOn", "desc")
                );
    
    const listingsQueryData = await getDocs(listingsQuery);
    
    // Map documents to WishList array
    const listings: WishList[] = listingsQueryData.docs.map((doc) => {
      const data = doc.data();
      return {
        BoatId: data.BoatId,
        BoatName: data.BoatName,
        CreatedOn: data.CreatedOn,
        Image: data.Image,
        Price: data.Price,
        UserEmail: data.UserEmail,
        UserId: data.UserId,
        dayCruisePrice: data.dayCruisePrice,
      } as WishList;
    });
    
    return listings;
  } catch (error) {
    console.log(error);
    return [];
  }
}