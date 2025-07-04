import toast from "react-hot-toast";
import { amount, TravelMode } from "../enums/enums";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";

export default async function CalculatePrice(
  finalAdultCount: number,
  finalChildCount: number,
  bookingDate: Date,
  listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> },
  cruiseType: string
): Promise<number | undefined> {
  try {
    // Early return if no booking date
    if (!bookingDate) {
      return undefined;
    }

    // Single data fetch - good optimization from new code
    const listingData = await listing.getboat.data();
    if (!listingData) {
      throw new Error("Unable to fetch listing data");
    }

    // Extract pricing data with fallbacks
    const {
      adultAddonPrice = 0,
      childAddonPrice = 0,
      dayAdultAddOnPrice = 0,
      dayChildAddOnPrice = 0,
      guestCount = 0,
      dayCruisePrice = 0,
      price = 0
    } = listingData;

    // Calculate additional costs based on cruise type
    const additionalAdults = Math.max(0, finalAdultCount - guestCount);
    
    let additionalAdultCost: number;
    let additionalChildCost: number;
    
    if (cruiseType === TravelMode.DayCruise) {
      additionalAdultCost = additionalAdults * dayAdultAddOnPrice;
      additionalChildCost = finalChildCount * dayChildAddOnPrice;
    } else {
      additionalAdultCost = additionalAdults * adultAddonPrice;
      additionalChildCost = finalChildCount * childAddonPrice;
    }

    // Set base price based on cruise type
    let basePrice: number;
    if (cruiseType === TravelMode.DayCruise) {
      basePrice = dayCruisePrice;
    } else if (cruiseType === TravelMode.OverNight) {
      basePrice = price;
    } else {
      basePrice = price; // Default fallback
    }

    // Calculate total before seasonal adjustments
    let totalPrice = basePrice + additionalAdultCost + additionalChildCost;

    // Apply weekend surcharge
    const bookingDay = bookingDate.getDay();
    if (bookingDay === 6 || bookingDay === 0) {
      totalPrice += amount.weekendPrice;
    }

    // Apply seasonal pricing multipliers and additions
    const bookingYear = bookingDate.getFullYear();
    
    // Summer vacation (May 1-31 of booking year)
    const isSummerVacation = bookingDate >= new Date(bookingYear, 4, 1) &&
                            bookingDate <= new Date(bookingYear, 4, 31);
    
    // Pre-Christmas season (Dec 14-20 of booking year)
    const isPreChristmasSeason = bookingDate >= new Date(bookingYear, 11, 13) &&
                                bookingDate <= new Date(bookingYear, 11, 19);
    
    // Christmas season (Dec 21 of booking year to Jan 8 of next year)
    const isChristmasSeason = bookingDate >= new Date(bookingYear, 11, 20) &&
                             bookingDate <= new Date(bookingYear + 1, 0, 8);

    // Apply seasonal adjustments
    if (isPreChristmasSeason) {
      totalPrice *= amount.preChristmas;
    }
    
    if (isChristmasSeason) {
      totalPrice *= amount.christmasSeason;
    }
    
    if (isSummerVacation) {
      totalPrice += amount.summerVaccationPrice;
    }

    return Math.round(totalPrice);

  } catch (error) {
    console.error("Price calculation error:", error);
    toast.error("Something went wrong while calculating price. Please contact us.");
    return undefined;
  }
}




// import toast from "react-hot-toast";
// import { amount, TravelMode } from "../enums/enums";
// import { DocumentData, DocumentSnapshot } from "firebase/firestore";

// export default async function CalculatePrice(finalAdultCount: number, finalChildCount: number, bookingDate: Date,
//   listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> },
//   cruiseType: string): Promise<number | undefined> {
//   try {

//     if (!bookingDate) {
//       return undefined;
//     }

//     const listingData = await listing.getboat.data();
//     if (!listingData) {
//       throw new Error("Unable to retrieve listing data");
//     }

//     // Extract pricing data with fallbacks
//     const {
//       adultAddonPrice = 0,
//       childAddonPrice = 0,
//       guestCount = 0,
//       dayCruisePrice = 0,
//       price = 0
//     } = listingData;

//     // Calculate additional costs
//     const additionalAdults = Math.max(0, finalAdultCount - guestCount);
//     const additionalAdultCost = additionalAdults * adultAddonPrice;
//     const additionalChildCost = finalChildCount * childAddonPrice;

//     // Set base price based on cruise type
//     let basePrice: number;
//     if (cruiseType === TravelMode.DayCruise) {
//       basePrice = dayCruisePrice;
//     } else if (cruiseType === TravelMode.OverNight) {
//       basePrice = price;
//     } else {
//       basePrice = price; // Default fallback
//     }

//     // Calculate total before seasonal adjustments
//     let totalPrice = basePrice + additionalAdultCost + additionalChildCost;

//     // Apply weekend surcharge
//     const bookingDay = bookingDate.getDay();
//     if (bookingDay === 6 || bookingDay === 0) {
//       totalPrice += amount.weekendPrice;
//     }

//     const bookingYear = bookingDate.getFullYear();

//     // Summer vacation (May 1-31 of booking year)
//     const isSummerVacation = bookingDate >= new Date(bookingYear, 4, 1) &&
//       bookingDate <= new Date(bookingYear, 4, 31);

//     // Pre-Christmas season (Dec 14-20 of booking year)
//     const isPreChristmasSeason = bookingDate >= new Date(bookingYear, 11, 13) &&
//       bookingDate <= new Date(bookingYear, 11, 19);

//     // Christmas season (Dec 21 of booking year to Jan 8 of next year)
//     const isChristmasSeason = bookingDate >= new Date(bookingYear, 11, 20) &&
//       bookingDate <= new Date(bookingYear + 1, 0, 8);

//     // Apply seasonal adjustments
//     if (isPreChristmasSeason) {
//       totalPrice *= amount.preChristmas;
//     }

//     if (isChristmasSeason) {
//       totalPrice *= amount.christmasSeason;
//     }

//     if (isSummerVacation) {
//       totalPrice += amount.summerVaccationPrice;
//     }

//     return Math.round(totalPrice);

//   } catch (error) {
//     console.error("Price calculation error:", error);
//     toast.error("Something went wrong while calculating price. Please contact us.");
//     return undefined;
//   }
// }
