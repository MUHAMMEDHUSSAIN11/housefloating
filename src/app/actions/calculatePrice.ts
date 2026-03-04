import { amount, BookingType } from "../enums/enums";

const CalculatePrice = async (
  finalAdultCount: number,
  dayPrice: number,
  boatRoomCount: number,
  roomCount: number,
  roomPrice: number,
  adultAddonPrice: number,
  boatMaxAdults: number,
  boatBaseGuestsSharing: number,
  boatBaseGuestsDayCruise: number,
  maxGuestCountPerRoomForNight: number,
  bookingTypeId?: number | null,
  isDayCruise?: boolean,
) => {
  const isSharing = bookingTypeId === BookingType.sharing;

  let totalPrice: number;
  let baseGuestCount: number;
  let maxGuestCount: number;

  if (isSharing) {
    totalPrice = roomCount * dayPrice;
    baseGuestCount = roomCount * boatBaseGuestsSharing;
    maxGuestCount = roomCount * boatMaxAdults;
  } else if (isDayCruise) {
    totalPrice = dayPrice;
    baseGuestCount = boatBaseGuestsDayCruise;
    maxGuestCount = boatMaxAdults;
  } else {
    totalPrice = dayPrice - ((boatRoomCount - roomCount) * roomPrice);
    baseGuestCount = roomCount * 2;
    maxGuestCount = roomCount * maxGuestCountPerRoomForNight;
  }

  if (finalAdultCount > baseGuestCount && finalAdultCount <= maxGuestCount) {
    const additionalAdults = finalAdultCount - baseGuestCount;
    totalPrice += additionalAdults * adultAddonPrice;
  }

  const strikeThroughPrice = Math.round(totalPrice * amount.commissionPercentage);

  return Math.round(strikeThroughPrice);
}

export default CalculatePrice;