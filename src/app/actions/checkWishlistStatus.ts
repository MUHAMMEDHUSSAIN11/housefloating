import { User } from "firebase/auth";
import { FirestoreListing } from "../components/ListingCard/ListingCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from '@/app/firebase/clientApp'

const checkWishlistStatus = async (user: User | null | undefined, data: FirestoreListing) => {
    if (user && data) {
        try {
            const q = query(
                collection(firestore, 'Wishlists'),
                where('BoatId', '==', data.docId),
                where('UserId', '==', user?.uid)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot;
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    }
    return false;
};

export default checkWishlistStatus;
