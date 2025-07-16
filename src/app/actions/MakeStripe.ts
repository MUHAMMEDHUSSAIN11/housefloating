import axios from "axios";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { amount } from "../enums/enums";
import dayjs from "dayjs";
import { Reservation } from "../cart/page";



export default async function MakeStripe(Order: Reservation) {
  try {
    const advanceAmount = Order.Price * amount.advance;
    const balanceAmount = Order.Price * amount.remaining;

    const formattedBookingDate = dayjs(Order.BookingDate.toDate()).format('DD-MM-YYYY');

    const OrderDetails: any[] = [Order.BoatTitle, advanceAmount, Order.Contactnumber, Order.Image];

    const metadata = {
      reservationId: Order.ReservationId,
      boatId: Order.BoatId,
      boatName: Order.BoatTitle,
      bookingDate: formattedBookingDate.toString(),
      userId : Order.UserId,
      userEmail: Order.Email,
      remainingAmount: balanceAmount,
      contactNumber : Order.Contactnumber
    };

    const { data } = await axios.post('/api/stripe/route',
      {
        items: OrderDetails,
        metadata,
      }
    );
    window.location.href = data.url;
  } catch (error: any) {
    toast.error("Sorry,Something went wrong. Contact our customer support");
  }
};

