import axios from "axios";
import { toast } from "sonner";

interface FirestoreListing {
    ReservationId : string;
    BoatId: string;
    BoatName: string;
    BookingDate: any;
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
  }

export default async function MakeStripe(Order:FirestoreListing) {
    try {
      const advanceAmount = Order.Price * 0.3 ;
        const OrderDetails:any[] = [Order.BoatName,advanceAmount,Order.Contactnumber,Order.Image];
        const metadata = {
          reservationId: Order.ReservationId,
          boatId: Order.BoatId, 
          bookingDate: Order.BookingDate.toISOString(), 
        };

        const { data } = await axios.post('/api/stripe/route',
          {
            items: OrderDetails,
            metadata,
          }
        );
        window.location.href = data.url;
      } catch (error:any) {
        toast.error("Sorry,Something went wrong. Contact our customer support");
      }
    };
    
