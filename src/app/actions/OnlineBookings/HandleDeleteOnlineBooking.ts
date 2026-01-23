import axios from "axios";
import jsCookie from "js-cookie";

interface HandleDeleteOnlineBookingProps {
    bookingId: number;
}

const HandleDeleteOnlineBooking = async ({ bookingId }: HandleDeleteOnlineBookingProps, authToken?: string) => {
    try {
        const token = authToken || jsCookie.get('token');
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/OnlineBookings/deleteOnlineBooking`, {
            params: { bookingId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('API Error in HandleDeleteOnlineBookings:', error);
        return null;
    }
};

export default HandleDeleteOnlineBooking;
