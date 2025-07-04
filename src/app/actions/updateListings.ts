import { doc, updateDoc } from "firebase/firestore";
import { Listing } from "./getListings";
import { firestore } from "../firebase/clientApp";

export async function updateListing(listingId: string, updatedData: Partial<Listing>): Promise<boolean> {
  try {
    const listingRef = doc(firestore, "Boats", listingId);
    
    // Remove id from updatedData if it exists to avoid updating the document ID
    const { id, ...dataToUpdate } = updatedData;
    
    await updateDoc(listingRef, dataToUpdate);
    return true;
  } catch (error) {
    console.error("Error updating listing:", error);
    return false;
  }
}