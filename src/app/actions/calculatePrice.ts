const CalculatePrice = async (
  finalAdultCount: number,
  finalChildCount: number,
  dayPrice:number,
  maxAdulCount: number,
  maxChildCount: number,
  guestCount: number,
  adultAddonPrice:number,
  childAddonPrice:number,
) => {
  let totalPrice = dayPrice;

  console.log(finalAdultCount)
  console.log(finalChildCount)

  if (finalAdultCount > guestCount && finalAdultCount <= maxAdulCount) {
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