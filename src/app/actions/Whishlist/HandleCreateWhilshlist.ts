import apiClient from '@/middleware/apiClient';

const Handlecreatewhishlist = async (boatId: number, userId: number): Promise<boolean> => {
    try {
        const response = await apiClient.post(`/api/Wishlists/toggleWishlist`, {
            boatId: boatId,
            userId: userId
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
