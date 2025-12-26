'use client';

import { BoatCruises } from "@/app/enums/enums";
import Button from "../Misc/Button";
import { useState } from "react";

interface ListingReservationProps {
  totalPrice: number;
  onSubmit: () => void;
  cruiseTypeId?: number;
  disabled?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({ totalPrice, onSubmit, cruiseTypeId, disabled }) => {
  const [isVeg, setIsVeg] = useState(false);
  const cruiseType = cruiseTypeId === BoatCruises.dayCruise ? "Day Cruise"
                    : cruiseTypeId === BoatCruises.overNightCruise ? "Overnight Cruise"
                    : "Night Stay Cruise";

  return (
    <div className="bg-white rounded-xl border border-neutral-200 sticky top-36 shadow-md">
      <div className="flex flex-col items-center gap-4 p-4 border-neutral-200">
        <div className="flex flex-row w-full gap-4">
        <div className="font-semibold">{cruiseType}</div>
          <div className="flex items-center ml-2 gap-2">
            <label className="inline-flex items-center ">
              <input type="radio" className="form-radio h-5 w-5 text-blue-600"
                checked={!isVeg} onChange={() =>{setIsVeg(false)}} />
              <span className="ml-2">Non-Veg</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input type="radio" className="form-radio h-5 w-5 text-blue-600"
                checked={isVeg} onChange={() =>{setIsVeg(true)}} />
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
  );
}

export default ListingReservation;