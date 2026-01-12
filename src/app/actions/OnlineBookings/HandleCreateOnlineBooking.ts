import axios from "axios";
import jsCookie from "js-cookie";

export interface CreateOnlineBookingData {
    adultCount: number | string;
    boatId: number | string;
    bookingDate: string;
    childCount: number | string;
    contactNumber: string;
    cruiseTypeId: number;
    guestPlace: string;
    guestUserId: number | string;
    isVeg: boolean;
    price: number | string;
    tripDate: string;
    boardingPoint: string;
    isSharing: boolean;
    transactionId: string;
    paymentModeId: number;
    totalPrice: number | string;
    advanceAmount: number | string;
    remainingAmount: number | string;
    roomCount?: number | string;
}

const HandleCreateOnlineBooking = async (data: CreateOnlineBookingData, authToken?: string) => {
    try {
        const token = authToken || jsCookie.get('token');
        console.log('Sending CreateOnlineBooking with token:', token ? 'Bearer Present' : 'NONE');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/OnlineBookings/createOnlineBooking`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('API Error in HandleCreateOnlineBooking:', error);
        throw error;
    }
};

export default HandleCreateOnlineBooking;
