import axios from 'axios';
import Cookies from 'js-cookie';

export interface WishlistItem {
    id: number;
    boatId: number;
    boat: {
        boatId: number | null;
        boatName: string | null;
        category: string | null;
        statusId: number | null;
        boatStatus: string | null;
        bedroomCount: number | null;
        userTypeId: number | null;
        imageUrl: string | null;
    }
}

export interface WishlistResponse {
    items: WishlistItem[];
}

const HandleGetWhishlist = async (): Promise<WishlistResponse | null> => {
    try {
        const token = Cookies.get('token');
        if (!token) {
            console.error('No access token found');
            return null;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/Wishlists/getAllWishlists`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (response.status === 200) {
            return response.data.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching wishlists:', error);
        return null;
    }
};

export default HandleGetWhishlist;
