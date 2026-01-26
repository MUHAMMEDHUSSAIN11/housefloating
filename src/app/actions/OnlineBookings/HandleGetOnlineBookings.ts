import apiClient from "@/middleware/apiClient";

const HandleGetOnlineBookings = async () => {
    try {
        const response = await apiClient.get(`/api/OnlineBookings/getMyOnlineBookings`);

        if (response.status >= 200 && response.status < 300) {
            return response.data.data.items;
        }

        return [];
    } catch (error) {
        console.error('API Error in HandleGetOnlineBookings:', error);
        return [];
    }
};

export default HandleGetOnlineBookings;
