'use client';

import { useEffect, useState } from "react";
import Dayselector from "../Inputs/DaySelector";
import Button from "../Misc/Button";
import useTravelModeStore from "@/app/hooks/useTravelModeStore";



//This component is used for displaying individual items..

interface ListingReservationProps {
  price: number;
  date: Date,
  totalPrice: number;
  onChangeDate: (value: any) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}


const ListingReservation: React.FC<ListingReservationProps> = ({ price, totalPrice, date, onChangeDate, onSubmit, disabled, disabledDates }) => {
  //sm:pt-2 needs to be rechecked

  const ModeStore = useTravelModeStore();

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden sm:pt-2 shadow-md">
      <div className="flex flex-row items-center gap-4 p-4 border-neutral-200">
        <div className="font-sans font-medium text-neutral-600">Select Option</div>
        <div className="flex items-center">
          <label className="inline-flex items-center ">
            <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="Overnight"
              checked={ModeStore.travelMode === 'Overnight'} onChange={() => ModeStore.setTravelMode('Overnight')} />
            <span className="ml-2">Overnight</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="DayCruise"
              checked={ModeStore.travelMode === 'DayCruise'} onChange={() => ModeStore.setTravelMode('DayCruise')} />
            <span className="ml-2">Day Cruise</span>
          </label>
        </div>
      </div>
      <hr />
      <Dayselector value={date} disabledDates={disabledDates} onChange={(value) => onChangeDate(value)} />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <hr />
      <div className="p-4 flex flex-col items-center">
          <div className="flex flex-row justify-between items-center  font-semibold text-lg">
            <div>Total</div>
            <div>{totalPrice}</div>
          </div>
          <div className="text-center text-xs mt-2">Please note that prices may change on weekends and holidays</div>
      </div>

    </div>
  );
}

export default ListingReservation;