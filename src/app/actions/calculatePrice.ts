import { toast } from "sonner";

export default async function CalculatePrice(finalAdultCount:number, finalChildCount:number, bookingDate:Date, listing:any) {
    try {
        if (!bookingDate) {
            return;
          }
          const adultPrice = 500;
          const childPrice = 250;
          const weekendPrice = 1000;
        
          const additionalAdultCost = await (finalAdultCount - (listing.getboat.data()?.guestCount || 0)) * adultPrice;
          const additionalChildCost = await finalChildCount * childPrice;
          const bookingDay = bookingDate.getDay();
        
          // Update total price based on conditions
          let newTotalPrice;
          if (bookingDay === 6 || bookingDay === 0) {
            newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost + weekendPrice;
          } else {
            newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost;
          }
        
          const isHolidaySeason = await bookingDate >= new Date(new Date().getFullYear(), 11, 1) && bookingDate <= new Date(new Date().getFullYear() + 1, 0, 15);
          if (isHolidaySeason) {
            newTotalPrice += 2500;
          }
          return newTotalPrice;
    } catch (error) {
        toast.error("Something went wrong!. Please Contact Us");
    }
   
  }
  