'use client';

import { BoatCruisesId } from "@/app/enums/enums";
import Button from "../Misc/Button";

interface ListingReservationProps {
  totalPrice: number;
  onSubmit: () => void;
  cruiseTypeId?: number;
  disabled?: boolean;
  isVeg: boolean;
  setIsVeg: (value: boolean) => void;
}

const ListingReservation: React.FC<ListingReservationProps> = ({ totalPrice, onSubmit, cruiseTypeId, disabled, isVeg, setIsVeg }) => {
  const cruiseType = cruiseTypeId === BoatCruisesId.dayCruise ? "Day Cruise"
    : cruiseTypeId === BoatCruisesId.overNightCruise ? "Overnight Cruise"
      : "Night Stay Cruise";

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl border border-neutral-200 sticky top-36 shadow-md">
        <div className="flex flex-col items-center gap-4 p-4 border-neutral-200">
          <div className="flex flex-row w-full gap-4">
            <div className="font-semibold">{cruiseType}</div>
            <div className="flex items-center ml-2 gap-2">
              <label className="inline-flex items-center ">
                <input type="radio" className="form-radio h-5 w-5 text-blue-600"
                  checked={!isVeg} onChange={() => { setIsVeg(false) }} />
                <span className="ml-2">Non-Veg</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" className="form-radio h-5 w-5 text-blue-600"
                  checked={isVeg} onChange={() => { setIsVeg(true) }} />
                <span className="ml-2">Veg</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 w-full justify-between text-start border rounded-lg p-4">
            <div className="flex flex-col border-r-2 pl-4">
              <div className="text-sm">CheckInTime</div>
              <div className="text-black">9:30Am</div>
            </div>
            <div className="flex flex-col pl-4">
              <div className="text-sm">CheckOutTime</div>
              <div className="text-black">12:30Pm</div>
            </div>
            <div className="col-span-2 pt-2 pl-4 border-t-2">
              <div className="text-xl font-semibold">₹{totalPrice}</div>
              <div className="text-xs">per day cruise</div>
            </div>
          </div>
          <div className="w-full">
            <Button disabled={disabled} label="Book Reservation" onClick={onSubmit} />
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mr-1 mb-1">
            <span className="text-sm font-medium text-gray-700">{cruiseType}</span>
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
                <span className="text-xs text-gray-500">/{cruiseTypeId === BoatCruisesId.dayCruise ? 'day' : 'night'}</span>
              </div>
            </div>
            <div className="flex-1 max-w-[150px]">
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