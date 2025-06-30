import { User } from "firebase/auth";
import { FirestoreListing } from "../components/ListingCard/ListingCard";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from '@/app/firebase/clientApp';

const removeWishlist = async (boatId: string, userId: string | undefined): Promise<boolean> => {
    try {
        // Query to find the wishlist item
        const q = query(
            collection(firestore, 'Wishlists'),
            where('BoatId', '==', boatId),
            where('UserId', '==', userId)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Delete the document
            const docToDelete = querySnapshot.docs[0];
            await deleteDoc(doc(firestore, 'Wishlists', docToDelete.id));

            console.log('Removed from wishlist successfully');
            return true;
        } else {
            console.log('Item not found in wishlist');
            return false;
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
    }
};

export default removeWishlist;