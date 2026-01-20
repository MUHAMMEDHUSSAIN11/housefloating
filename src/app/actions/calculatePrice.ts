import { BookingType } from "../enums/enums";

const CalculatePrice = async (
  finalAdultCount: number,
  finalChildCount: number,
  dayPrice:number,
  maxAdultCount: number,
  maxChildCount: number,
  guestCount: number,
  adultAddonPrice:number,
  childAddonPrice:number,
  roomCount: number,
  bookingTypeId?: number | null,
) => {
  const isSharing = bookingTypeId === BookingType.sharing;
  guestCount = isSharing ? roomCount * guestCount : guestCount;
  maxAdultCount = isSharing ? roomCount * maxAdultCount : maxAdultCount;
  maxChildCount = isSharing ? roomCount * maxChildCount : maxChildCount;
  let totalPrice = isSharing ? roomCount * dayPrice : dayPrice;

  if (finalAdultCount >  guestCount && finalAdultCount <=  maxAdultCount) {
    const additionalAdults = finalAdultCount - guestCount;
    totalPrice += additionalAdults * adultAddonPrice;
  }

  if (finalAdultCount < guestCount) {
    if(finalChildCount + finalAdultCount > guestCount){
      const additionalChildren = (finalChildCount + finalAdultCount) - guestCount;
      totalPrice += additionalChildren * childAddonPrice;
    }
  } else {
      if(finalChildCount <= maxChildCount){
        totalPrice += finalChildCount * childAddonPrice;
      }
    }

  return Math.round(totalPrice);
}

export default CalculatePrice;