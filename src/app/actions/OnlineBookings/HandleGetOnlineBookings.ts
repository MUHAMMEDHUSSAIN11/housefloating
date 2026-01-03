import axios from "axios";
import jsCookie from "js-cookie";

const HandleGetOnlineBookings = async () => {
    try {
        const token = jsCookie.get('token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/OnlineBookings/getMyOnlineBookings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error('API Error in HandleGetOnlineBookings:', error);
        return [];
    }
};

export default HandleGetOnlineBookings;
