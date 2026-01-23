import axios from "axios";
import toast from "react-hot-toast";
import { amount as amountEnum, PaymentModes } from "../enums/enums";
import HandleCreateOnlinePayment from "./OnlinePayments/HandleCreateOnlinePayment";
import jsCookie from 'js-cookie';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

interface RazorpayOptions {
    totalPrice: number;
    description: string;
    image?: string;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    metadata: any;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

const MakeRazorpay = async (options: RazorpayOptions) => {
    try {
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error("Razorpay SDK failed to load.");
            if (options.onError) options.onError("SDK failed to load");
            return;
        }

        const advanceAmount = options.totalPrice * amountEnum.advance;
        const remainingAmount = options.totalPrice * amountEnum.remaining;

        const token = jsCookie.get('token');
        const finalMetadata = {
            ...options.metadata,
            totalPrice: options.totalPrice,
            advanceAmount: advanceAmount,
            remainingAmount: remainingAmount,
            authToken: token,
        };

        const { data: order } = await axios.post('/api/razorpay/order', {
            amount: advanceAmount,
            metadata: finalMetadata
        });

        const rzpOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "House Floating",
            description: options.description,
            image: options.image || '/placeholder-boat.jpg',
            order_id: order.id,
            method: {
                card: true,
                upi: true,
                netbanking: true,
                wallet: false,
                emi: false,
                paylater: false
            },
            handler: async function (response: any) {
                let paymentModeId = PaymentModes.UPI;

                try {
                    try {
                        const verifyRes = await axios.post('/api/razorpay/verify', {
                            paymentId: response.razorpay_payment_id
                        });
                        if (verifyRes.data?.paymentModeId) {
                            paymentModeId = verifyRes.data.paymentModeId;
                        }
                    } catch (verifyError) {
                        console.error('Verification API failed, using default UPI:', verifyError);
                    }

                    const paymentData = {
                        advanceAmount: Number(finalMetadata.advanceAmount),
                        onlineBookingId: Number(finalMetadata.onlineBookingId),
                        paymentModeId: paymentModeId,
                        remainingAmount: Number(finalMetadata.remainingAmount),
                        totalPrice: Number(finalMetadata.totalPrice),
                        transactionId: String(response.razorpay_payment_id)
                    };
                    await HandleCreateOnlinePayment(paymentData, finalMetadata.authToken);
                    toast.success("Payment Successful!");
                    if (options.onSuccess) options.onSuccess();
                    else window.location.href = "/cart";
                } catch (error) {
                    console.error('Payment Creation Error:', error);
                    toast.error("Payment recorded but failed to sync. Please contact support.");
                    if (options.onSuccess) options.onSuccess();
                    else window.location.href = "/cart";
                }
            },
            prefill: options.prefill,
            notes: finalMetadata,
            theme: { color: "#3399cc" },
            modal: {
                ondismiss: () => {
                    if (options.onError) options.onError('Payment cancelled');
                }
            }
        };

        const paymentObject = new (window as any).Razorpay(rzpOptions);
        paymentObject.open();

    } catch (error) {
        console.error('Razorpay Error:', error);
        toast.error('Failed to initialize payment');
        if (options.onError) options.onError(error);
    }
};

export default MakeRazorpay;
