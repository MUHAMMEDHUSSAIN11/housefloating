import axios from "axios";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { amount } from "../enums/enums";
import dayjs from "dayjs";

interface FirestoreListing {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BookingDate: Timestamp;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: number;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
  UserId: string;
}

export default async function MakeStripe(Order: FirestoreListing) {
  try {
    const advanceAmount = Order.Price * amount.advance;
    const balanceAmount = Order.Price * amount.remaining;

    const formattedBookingDate = dayjs(Order.BookingDate.toDate()).format('DD-MM-YYYY');

    const OrderDetails: any[] = [Order.BoatName, advanceAmount, Order.Contactnumber, Order.Image];

    const metadata = {
      reservationId: Order.ReservationId,
      boatId: Order.BoatId,
      boatName: Order.BoatName,
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

