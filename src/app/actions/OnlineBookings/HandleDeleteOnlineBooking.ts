import apiClient from "@/middleware/apiClient";

interface HandleDeleteOnlineBookingProps {
    bookingId: number;
}

const HandleDeleteOnlineBooking = async ({ bookingId }: HandleDeleteOnlineBookingProps) => {
    try {
        const response = await apiClient.delete(`/api/OnlineBookings/deleteOnlineBooking`,{
            params: { 
                bookingId
            },
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
