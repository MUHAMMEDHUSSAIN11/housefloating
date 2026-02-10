import { amount, BookingType } from "../enums/enums";

const CalculatePrice = async (
  finalAdultCount: number,
  dayPrice:number,
  maxAdultCount: number,
  guestCount: number,
  adultAddonPrice:number,
  roomCount: number,
  bookingTypeId?: number | null,
) => {
  const isSharing = bookingTypeId === BookingType.sharing;
  guestCount = isSharing ? roomCount * guestCount : guestCount;
  maxAdultCount = isSharing ? roomCount * maxAdultCount : maxAdultCount;
  let totalPrice = isSharing ? roomCount * dayPrice : dayPrice;

  if (finalAdultCount >  guestCount && finalAdultCount <=  maxAdultCount) {
    const additionalAdults = finalAdultCount - guestCount;
    totalPrice += additionalAdults * adultAddonPrice;
  }
 
  const strikeThroughPrice = Math.round(totalPrice * amount.commissionPercentage);

  return Math.round(strikeThroughPrice);
}

export default CalculatePrice;