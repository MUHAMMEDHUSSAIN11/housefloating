import axios from "axios";
import jsCookie from "js-cookie";

export interface CreateOnlinePaymentData {
    advanceAmount: number | string;
    onlineBookingId: number | string;
    paymentModeId: number;
    remainingAmount: number | string;
    totalPrice: number | string;
    transactionId: string;
}

const HandleCreateOnlinePayment = async (data: CreateOnlinePaymentData, authToken?: string) => {
    try {
        const token = authToken || jsCookie.get('token');
        console.log('Sending CreateOnlinePayment with token:', token ? 'Bearer Present' : 'NONE');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/OnlinePayments/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('API Error in HandleCreateOnlinePayment:', error);
        throw error;
    }
};

export default HandleCreateOnlinePayment;
