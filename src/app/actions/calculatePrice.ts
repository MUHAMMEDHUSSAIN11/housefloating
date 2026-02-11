import { amount, BookingType } from "../enums/enums";

const CalculatePrice = async (
  finalAdultCount: number,
  dayPrice: number,
  boatRoomCount: number,
  roomCount: number,
  roomPrice: number,
  adultAddonPrice: number,
  boatMaxAdults: number,
  boatBaseGuests: number,
  bookingTypeId?: number | null,
  isDayCruise?:boolean,
) => {
  const isSharing = bookingTypeId === BookingType.sharing;

  let totalPrice: number;
  let baseGuestCount: number;
  let maxGuestCount: number;

  if (isSharing) {
    totalPrice = roomCount * dayPrice;
    baseGuestCount = roomCount * boatBaseGuests;
    maxGuestCount = roomCount * boatMaxAdults;
  } else if (isDayCruise) {
    totalPrice = dayPrice;
    baseGuestCount = boatBaseGuests;
    maxGuestCount = boatMaxAdults;
  } else {
    totalPrice = dayPrice - ((boatRoomCount - roomCount) * roomPrice);
    baseGuestCount = roomCount * 2;
    maxGuestCount = roomCount * 3;
  }

  if (finalAdultCount > baseGuestCount && finalAdultCount <= maxGuestCount) {
    const additionalAdults = finalAdultCount - baseGuestCount;
    totalPrice += additionalAdults * adultAddonPrice;
  }

  const strikeThroughPrice = Math.round(totalPrice * amount.commissionPercentage);

  return Math.round(strikeThroughPrice);
}

export default CalculatePrice;