import axios from "axios";
import jsCookie from "js-cookie";

export interface CreateOnlinePaymentData {
    advanceAmount: number;
    bookingId: number;
    paymentModeId: number;
    paymentStatusId: number;
    remainingAmount: number;
    totalPrice: number;
    transactionId: string;
}

const HandleCreateOnlinePayment = async (data: CreateOnlinePaymentData) => {
    try {
        const token = jsCookie.get('token');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/OnlinePayments/createOnlinePayment`, data, {
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
