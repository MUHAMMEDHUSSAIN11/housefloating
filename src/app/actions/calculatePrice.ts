import toast from "react-hot-toast";
import { amount, TravelMode } from "../enums/enums";

export default async function CalculatePrice(finalAdultCount: number,
  finalChildCount: number,
  bookingDate: Date,
  listing: any,
  cruiseType: string) {
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

    // const isHolidaySeason = await bookingDate >= new Date(new Date().getFullYear(), 11, 1) && bookingDate <= new Date(new Date().getFullYear() + 1, 0, 15);
    const isPreChristmasSeason = bookingDate >= new Date(new Date().getFullYear(), 11, 13)
      && bookingDate <= new Date(new Date().getFullYear(), 11, 19);

    const isChristmasSeason = bookingDate >= new Date(new Date().getFullYear(), 11, 20)
      && bookingDate <= new Date(new Date().getFullYear() + 1, 0, 8);

    // const isSummerVaccation = bookingDate >= new Date(new Date().getFullYear(), 4, 1)
    //   && bookingDate <= new Date(new Date().getFullYear(), 5, 31);

    const isSummerVaccation = bookingDate >= new Date(new Date().getFullYear(), 4, 1)
      && bookingDate <= new Date(new Date().getFullYear(), 5, 0);


    if (isPreChristmasSeason) {
      newTotalPrice = newTotalPrice * amount.preChristmas;
    }

    if (isChristmasSeason) {
      newTotalPrice = newTotalPrice * amount.christmasSeason;
    }
    //summer vaccation prices
    if (isSummerVaccation) {
      newTotalPrice = newTotalPrice + amount.summerVaccationPrice;
    }

    //different Price for Day Cruise

    if (cruiseType == TravelMode.DayCruise) {
      newTotalPrice = newTotalPrice - amount.dayCruiseReduction;
    }

    return Math.round(newTotalPrice);

  } catch (error) {
    toast.error("Something went wrong while fetching Price!. Please Contact Us");
  }
}
