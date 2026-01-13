import axios from 'axios';
import Cookies from 'js-cookie';

const Handlecreatewhishlist = async (boatId: number, userId: number): Promise<boolean> => {
    try {
        const token = Cookies.get('token');
        if (!token) {
            console.error('No access token found');
            return false;
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/Wishlists/toggleWishlist`, {
            boatId: boatId,
            userId: userId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.status === 200) {
            console.log('Wishlist toggled successfully');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        return false;
    }
};

export default Handlecreatewhishlist;
