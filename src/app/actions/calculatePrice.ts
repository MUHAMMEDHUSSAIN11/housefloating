import toast from "react-hot-toast";
import { amount } from "../enums/enums";

export default async function CalculatePrice(finalAdultCount: number, finalChildCount: number, bookingDate: Date, listing: any) {
  try {
    if (!bookingDate) {
      return;
    }
    const adultPrice = await listing.getboat.data()?.adultAddonPrice;
    const childPrice = await listing.getboat.data()?.childAddonPrice;

    const additionalAdultCost = await (finalAdultCount - (listing.getboat.data()?.guestCount || 0)) * adultPrice;
    const additionalChildCost = await finalChildCount * childPrice;
    const bookingDay = bookingDate.getDay();

    // Update total price based on conditions
    let newTotalPrice;
    if (bookingDay === 6 || bookingDay === 0) {
      newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost + amount.weekendPrice;
    } else {
      newTotalPrice = (listing.getboat.data()?.price || 0) + additionalAdultCost + additionalChildCost;
    }

    const isHolidaySeason = await bookingDate >= new Date(new Date().getFullYear(), 11, 1) && bookingDate <= new Date(new Date().getFullYear() + 1, 0, 15);

    if (isHolidaySeason) {
      newTotalPrice += amount.holidayPrice;
    }
    return newTotalPrice;
  } catch (error) {
    toast.error("Something went wrong while fetching Price!. Please Contact Us");
  }
}
