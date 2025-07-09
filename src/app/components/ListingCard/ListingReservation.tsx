'use client';

import { TravelMode } from "@/app/enums/enums";
import Dayselector from "../Inputs/DaySelector";
import Button from "../Misc/Button";
import useTravelModeStore from "@/app/hooks/useTravelModeStore";

interface ListingReservationProps {
  price: number;
  date: Date,
  totalPrice: number;
  onChangeDate: (value: any) => void;
  onSubmit: () => void;
  setAdultCount: (value: number) => void,
  setChildCount: (value: number) => void,
  disabled?: boolean;
  disabledDates: Date[];
  guestCount: number,
}

const ListingReservation: React.FC<ListingReservationProps> = ({ price, setAdultCount, setChildCount, totalPrice, date, onChangeDate, onSubmit, disabled, disabledDates, guestCount }) => {

  const ModeStore = useTravelModeStore();

  const changeTravelMode = (travelMode: TravelMode) => {
    ModeStore.setTravelMode(travelMode);
    setAdultCount(guestCount);
  };


  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden sm:pt-2 shadow-md">
      <div className="flex flex-row items-center gap-4 p-4 border-neutral-200">
        <div className="font-sans font-medium text-neutral-600">Select Option</div>
        <div className="flex items-center">

          <label className="inline-flex items-center ">
            <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="DayCruise"
              checked={ModeStore.travelMode === 'DayCruise'} onChange={() => changeTravelMode(TravelMode.DayCruise)} />
            <span className="ml-2">Day Cruise</span>
          </label>
          
          <label className="inline-flex items-center ml-4">
            <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="Overnight"
              checked={ModeStore.travelMode === 'Overnight'} onChange={() => changeTravelMode(TravelMode.OverNight)} />
            <span className="ml-2">Overnight</span>
          </label>
          
        </div>
      </div>
      <hr />
      <Dayselector value={date} disabledDates={disabledDates} onChange={(value) => onChangeDate(value)} />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label=" Request Reservation" onClick={onSubmit} />
      </div>
      <hr />
      <div className="p-4 flex flex-col items-center">
        <div className="flex flex-row justify-between items-center  font-semibold text-lg">
          <div>₹{totalPrice}</div>
        </div>
        <div className="text-center text-xs mt-2">Please note that prices may change on weekends and holidays</div>
      </div>

    </div>
  );
}

export default ListingReservation;