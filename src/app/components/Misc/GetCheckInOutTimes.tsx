import { BoatCruisesId, CheckInOutTimes, BookingType } from "@/app/enums/enums";

const GetCheckInOutTimes = (cruiseTypeId: number | undefined, bookingTypeId: number | null | undefined): { checkIn: string; checkOut: string } => {
    const isSharing = bookingTypeId === BookingType.sharing;

    if (isSharing) {
        if (cruiseTypeId === BoatCruisesId.dayCruise) {
            return {
                checkIn: CheckInOutTimes.SharingDayCruiseCheckIn,
                checkOut: CheckInOutTimes.SharingDayCruiseCheckOut,
            };
        } else if (cruiseTypeId === BoatCruisesId.dayNight) {
            return {
                checkIn: CheckInOutTimes.SharingDayNightCheckIn,
                checkOut: CheckInOutTimes.SharingDayNightCheckOut,
            };
        } else {
            return {
                checkIn: CheckInOutTimes.SharingNightStayCheckIn,
                checkOut: CheckInOutTimes.SharingNightStayCheckOut,
            };
        }
    } else {
        // Private booking
        if (cruiseTypeId === BoatCruisesId.dayCruise) {
            return {
                checkIn: CheckInOutTimes.PrivateDayCruiseCheckIn,
                checkOut: CheckInOutTimes.PrivateDayCruiseCheckOut,
            };
        } else if (cruiseTypeId === BoatCruisesId.dayNight) {
            return {
                checkIn: CheckInOutTimes.PrivateDayNightCheckIn,
                checkOut: CheckInOutTimes.PrivateDayNightCheckOut,
            };
        } else {
            return {
                checkIn: CheckInOutTimes.PrivateNightStayCheckIn,
                checkOut: CheckInOutTimes.PrivateNightStayCheckOut,
            };
        }
    }
};

export default GetCheckInOutTimes;