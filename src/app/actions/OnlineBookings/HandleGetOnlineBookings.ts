import apiClient from "@/middleware/apiClient";
import jsCookie from "js-cookie";

const HandleGetOnlineBookings = async () => {
    try {
        const response = await apiClient.get(`/api/OnlineBookings/getMyOnlineBookings`);

        if (response.status >= 200 && response.status < 300) {
            console.log('Online Bookings Data:', response.data.data);
            return response.data.data.items;
        }

        return [];
    } catch (error) {
        console.error('API Error in HandleGetOnlineBookings:', error);
        return [];
    }
};

export default HandleGetOnlineBookings;
