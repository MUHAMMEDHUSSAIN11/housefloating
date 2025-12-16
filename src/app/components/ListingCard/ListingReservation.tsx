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
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-md">
      <div className="flex flex-col items-center gap-4 p-4 border-neutral-200">
        <div className="flex flex-row w-full gap-4">
        <div className="font-semibold">DayCruise</div>
          <div className="flex items-center ml-2 gap-2">
            <label className="inline-flex items-center ">
              <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="DayCruise"
                checked={ModeStore.travelMode === 'DayCruise'} onChange={() => changeTravelMode(TravelMode.DayCruise)} />
              <span className="ml-2">Non-Veg</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input type="radio" className="form-radio h-5 w-5 text-blue-600" value="Overnight"
                checked={ModeStore.travelMode === 'Overnight'} onChange={() => changeTravelMode(TravelMode.OverNight)} />
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
              <div className="text-xl font-semibold">₹{price}</div>
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