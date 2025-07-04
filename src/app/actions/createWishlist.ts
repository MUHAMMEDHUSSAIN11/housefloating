import { User } from "firebase/auth";
import { FirestoreListing } from "../components/ListingCard/ListingCard";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from '@/app/firebase/clientApp';

const createWishlist = async ( boatData: FirestoreListing, user: User ): Promise<boolean> => {
    try {
        const wishlistItem = {
            BoatId: boatData.docId,
            BoatName: boatData.guestTitle,
            CreatedOn: new Date().toISOString(),
            UserEmail: user.email,
            UserId: user.uid,
            Image: boatData.images[0],
            Price: boatData.price
        };
        
        // Add to Firestore collection
        await addDoc(collection(firestore, 'Wishlists'), wishlistItem);

        console.log('Added to wishlist successfully');
        return true; // Return success status
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return false; // Return failure status
    }
};

export default createWishlist;