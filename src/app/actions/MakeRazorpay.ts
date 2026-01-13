import axios from "axios";
import toast from "react-hot-toast";
import { amount as amountEnum, PaymentModes } from "../enums/enums";
import HandleCreateOnlineBooking from "./OnlineBookings/HandleCreateOnlineBooking";
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
            return;
        }

        const advanceAmount = options.totalPrice * amountEnum.advance;
        const remainingAmount = options.totalPrice * amountEnum.remaining;

        // Add authToken to metadata so Webhook can use it
        const token = jsCookie.get('token');
        const finalMetadata = {
            ...options.metadata,
            totalPrice: options.totalPrice,
            advanceAmount: advanceAmount,
            remainingAmount: remainingAmount,
            authToken: token, // Webhook will use this
        };

        const { data: order } = await axios.post('/api/razorpay/route', {
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
            handler: async function (response: any) {
                const bookingData = {
                    adultCount: Number(finalMetadata.adultCount),
                    boatId: Number(finalMetadata.boatId),
                    bookingDate: new Date().toISOString(),
                    childCount: Number(finalMetadata.childCount),
                    contactNumber: String(finalMetadata.contactNumber),
                    cruiseTypeId: Number(finalMetadata.cruiseTypeId),
                    guestPlace: String(finalMetadata.boardingPoint || ''),
                    guestUserId: Number(finalMetadata.userId || finalMetadata.guestUserId),
                    isVeg: Boolean(finalMetadata.isVeg),
                    price: Number(finalMetadata.totalPrice),
                    tripDate: String(finalMetadata.tripDate),
                    boardingPoint: String(finalMetadata.boardingPoint || ''),
                    isSharing: Boolean(finalMetadata.isSharing),
                    transactionId: String(response.razorpay_payment_id),
                    paymentModeId: PaymentModes.UPI,
                    totalPrice: Number(finalMetadata.totalPrice),
                    advanceAmount: Number(finalMetadata.advanceAmount),
                    remainingAmount: Number(finalMetadata.remainingAmount),
                    roomCount: finalMetadata.roomCount ? Number(finalMetadata.roomCount) : undefined
                };

                try {
                    // 1. Verify Payment Mode Server-Side
                    try {
                        const verifyRes = await axios.post('/api/razorpay/verify', {
                            paymentId: response.razorpay_payment_id
                        });
                        if (verifyRes.data?.paymentModeId) {
                            bookingData.paymentModeId = verifyRes.data.paymentModeId;
                        }
                    } catch (verifyError) {
                        console.error('Verification API failed, using default UPI:', verifyError);
                    }

                    // 2. Create Booking with Correct Mode
                    await HandleCreateOnlineBooking(bookingData, finalMetadata.authToken);
                    toast.success("Payment Successful!");
                    if (options.onSuccess) options.onSuccess();
                    else window.location.href = "/cart";
                } catch (error) {
                    console.error('Booking Update Error:', error);
                    toast.success("Payment Received! Your booking is being processed.");
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
    }
};

export default MakeRazorpay;
