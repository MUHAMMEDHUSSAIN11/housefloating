import axios from "axios";
import toast from "react-hot-toast";
import { amount as amountEnum, PaymentModes } from "../enums/enums";
import { Reservation } from "../cart/page";
import HandleCreateOnlineBooking from "./OnlineBookings/HandleCreateOnlineBooking";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export default async function MakeRazorpay(Order: Reservation) {
    try {
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const advanceAmount = Order.Price * amountEnum.advance;
        const balanceAmount = Order.Price * amountEnum.remaining;

        const metadata = {
            boatId: Order.BoatId,
            userId: Order.UserId,
            remainingAmount: balanceAmount,
            totalPrice: Order.Price,
            contactNumber: Order.Contactnumber,
            adultCount: Order.HeadCount,
            childCount: Order.MinorCount,
            tripDate: Order.BookingDate, // In cart, BookingDate is the trip date
            cruiseTypeId: Order.Mode === 'Day Cruise' ? 1 : Order.Mode === 'Overnight Cruise' ? 2 : 3, // Mapping cruise type
            isVeg: false, // Defaulting if not in Order object
            boardingPoint: '', // Defaulting
            isSharing: false,
        };

        // Create Order in backend
        const { data: order } = await axios.post('/api/razorpay/route', {
            amount: advanceAmount,
            metadata
        });

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "House Floating",
            description: `Booking for ${Order.BoatTitle}`,
            image: Order.Image,
            order_id: order.id,
            handler: async function (response: any) {
                const onlineBookingData = {
                    adultCount: Order.HeadCount,
                    boatId: Order.BoatId,
                    bookingDate: new Date().toISOString(),
                    childCount: Order.MinorCount,
                    contactNumber: Order.Contactnumber,
                    cruiseTypeId: Order.Mode === 'Day Cruise' ? 1 : Order.Mode === 'Overnight Cruise' ? 2 : 3,
                    guestPlace: '', // Defaulting
                    guestUserId: Order.UserId,
                    isVeg: false,
                    price: Order.Price,
                    tripDate: Order.BookingDate,
                    boardingPoint: '',
                    isSharing: false,
                    transactionId: response.razorpay_payment_id,
                    paymentModeId: PaymentModes.UPI, // Default
                    totalPrice: Order.Price,
                    advanceAmount: Order.Price * amountEnum.advance,
                    remainingAmount: Order.Price * amountEnum.remaining
                };

                await HandleCreateOnlineBooking(onlineBookingData)
                    .then(() => {
                        toast.success("Payment Successful!");
                        window.location.href = "/cart";
                    })
                    .catch((error) => {
                        console.error('Booking Update Error:', error);
                        // Fallback to webhook redirect
                        toast.success("Payment Successful! Processing your order...");
                        window.location.href = "/cart";
                    });
            },
            prefill: {
                name: Order.Email,
                email: Order.Email,
                contact: Order.Contactnumber,
            },
            notes: metadata,
            theme: {
                color: "#3399cc",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

    } catch (error: any) {
        console.error("Razorpay Error:", error);
        toast.error("Sorry, Something went wrong. Contact our customer support");
    }
};
