import apiClient from '@/middleware/apiClient';

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
        const response = await apiClient.get(`/api/Wishlists/getAllWishlists`);
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
