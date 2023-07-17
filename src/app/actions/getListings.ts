import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";



export default async function getListings() {
  try {
    const listingRef = collection(firestore, "Boats");
    const listingsQueryData = await getDocs(listingRef);
    const listings = listingsQueryData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return listings;
  } catch (error:any) {
    console.log(error)
    return null;
  }
}





