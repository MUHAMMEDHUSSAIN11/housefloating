'use client';

import { BoatCruisesId, CheckInOutTimes, BookingType, BookingStatuses, BoatCruises } from "@/app/enums/enums";
import Button from "../Misc/Button";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import { is } from "date-fns/locale";

interface ListingReservationProps {
  totalPrice: number;
  onSubmit: () => void;
  cruiseTypeId?: number;
  bookingTypeId?: number | null;
  selectedDate: Date;
  roomCount: number;
  guestCount: number;
  disabled?: boolean;
  isVeg: boolean;
  setIsVeg: (value: boolean) => void;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  totalPrice,
  onSubmit,
  cruiseTypeId,
  bookingTypeId,
  roomCount,
  guestCount,
  disabled,
  isVeg,
  setIsVeg,
  selectedDate
}) => {
  const isSharing = bookingTypeId === BookingType.sharing;
  const cruiseType = cruiseTypeId === BoatCruisesId.dayCruise ? BoatCruises.dayCruise
    : cruiseTypeId === BoatCruisesId.dayNight ? BoatCruises.dayNight
      : BoatCruises.nightStay;

    const formattedStartDate = format(selectedDate, 'dd MMM');
    const dateDisplay = cruiseTypeId === BoatCruisesId.dayCruise
    ? formattedStartDate
    : `${formattedStartDate} - ${format(addDays(selectedDate, 1), 'dd MMM')}`;

  // Function to get check-in and check-out times based on booking type and cruise type
  const getCheckInOutTimes = (): { checkIn: string; checkOut: string } => {

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

  const { checkIn, checkOut } = getCheckInOutTimes();

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl border border-neutral-200 sticky top-36 shadow-md">
        <div className="flex flex-col items-center gap-4 p-4 border-neutral-200">
          <div className="flex flex-row w-full gap-4">
            <div className="font-semibold">
              {cruiseType} •{isSharing ? ` Sharing` : ` Private`}
              <div className="text-sm font-medium text-neutral-500">{dateDisplay}</div>
            </div>
            <div className="flex items-center ml-2 gap-2">
              <label className="inline-flex items-center cursor-pointer group">
                <input type="radio" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  checked={!isVeg} onChange={() => { setIsVeg(false) }} />
                <span className="ml-2 group-hover:text-blue-600 transition-colors">Non-Veg</span>
              </label>
              <label className="inline-flex items-center ml-4 cursor-pointer group">
                <input type="radio" className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  checked={isVeg} onChange={() => { setIsVeg(true) }} />
                <span className="ml-2 group-hover:text-blue-600 transition-colors">Veg</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full justify-between text-start border border-gray-300 rounded-lg p-4">
            <div className="flex flex-col border-r-2 border-gray-300 pl-4">
              <div className="text-sm">CheckInTime</div>
              <div className="text-black">{checkIn}</div>
            </div>
            <div className="flex flex-col pl-4">
              <div className="text-sm">CheckOutTime</div>
              <div className="text-black">{checkOut}</div>
            </div>
            <div className="col-span-2 pt-2 pl-4 border-t-2 border-gray-300">
              <div className="text-xl font-semibold">₹{totalPrice}</div>
               <span className="text-xs text-gray-500">{`${guestCount} guest - for ${roomCount} bedroom`}</span>
            </div>
          </div>
          <div className="w-full">
            <Button disabled={disabled} label="Book Now" onClick={onSubmit} />
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mr-1 mb-1">
            <span className="text-sm font-medium text-gray-700">
              {cruiseType} •{isSharing ? ` Sharing` : ` Private`}
              <div className="text-sm font-medium text-neutral-500">{dateDisplay}</div>
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                  checked={!isVeg}
                  onChange={() => setIsVeg(false)}
                />
                <span className="text-xs font-semibold text-neutral-600">Non-Veg</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500"
                  checked={isVeg}
                  onChange={() => setIsVeg(true)}
                />
                <span className="text-xs font-semibold text-neutral-600">Veg</span>
              </label>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-black">₹{totalPrice}</span>
                <span className="text-xs text-gray-500">/ `${guestCount} guest - for ${roomCount} bedroom`</span>
              </div>
            </div>
            <div className="flex-1 max-w-150">
              <Button
                disabled={disabled}
                label="Book Now"
                onClick={onSubmit}
                small
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListingReservation;