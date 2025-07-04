import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

export async function deleteListing(listingId: string): Promise<boolean> {
  try {
    const listingRef = doc(firestore, "Boats", listingId);
    await deleteDoc(listingRef);
    return true;
  } catch (error) {
    console.error("Error deleting listing:", error);
    return false;
  }
}
