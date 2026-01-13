import axios from "axios";
import jsCookie from "js-cookie";

export interface CancelOnlineBookingData {
    bookingId: number | string;
    tripDate: Date;
}

const HandleCancelOnlineBooking = async (data: CancelOnlineBookingData) => {
    try {
        const token = jsCookie.get('token');

        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API}/api/OnlinePayments/cancelOnlineBooking`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('API Error in HandleCancelOnlineBooking:', error);
        throw error;
    }
};

export default HandleCancelOnlineBooking;
