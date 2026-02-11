import apiClient from "@/middleware/apiClient";

export interface CreateOnlineBookingData {
    adultCount: number | string;
    boatId: number | string;
    bookingDate: string;
    contactNumber: string;
    cruiseTypeId: number;
    guestName: string;
    guestPlace: string | null;
    guestUserId: number | string;
    isVeg: boolean;
    price: number | string;
    tripDate: string;
    boardingPoint: string;
    isSharing: boolean;
    roomCount?: number | string;
}

const HandleCreateOnlineBooking = async (data: CreateOnlineBookingData, authToken?: string) => {
    try {
        const response = await apiClient.post(`/api/OnlineBookings/createOnlineBooking`, data);

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
