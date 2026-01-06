import axios from "axios";
import toast from "react-hot-toast";
import { amount } from "../enums/enums";
import { Reservation } from "../cart/page";

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

        const advanceAmount = Order.Price * amount.advance;
        const balanceAmount = Order.Price * amount.remaining;

        const metadata = {
            reservationId: Order.ReservationId,
            boatId: Order.BoatId,
            boatName: Order.BoatTitle,
            bookingDate: new Date(Order.BookingDate).toISOString(),
            userId: Order.UserId,
            userEmail: Order.Email,
            remainingAmount: balanceAmount,
            totalPrice: Order.Price,
            contactNumber: Order.Contactnumber
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
            handler: function (response: any) {
                // Razorpay handles the payment, we rely on the webhook to confirm the booking.
                // But we can show a success message or redirect here too.
                toast.success("Payment Successful! Your booking is being processed.");
                window.location.href = "/cart";
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
