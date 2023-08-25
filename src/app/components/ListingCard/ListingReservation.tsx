'use client';

import Dayselector from "../Inputs/DaySelector";
import Button from "../Misc/Button";



//This component is used for displating individual items..

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
//smpt-2 needs to be rechecked
  return (
  <div className=" bg-white  rounded-xl  border-[1px] border-neutral-200  overflow-hidden sm:pt-2">
    <div className="flex flex-row items-center gap-1 p-4">
      <div className="font-light text-neutral-600">Starting From </div>
      <div className="text-2xl font-semibold"> ₹ {price} </div>
      </div>
      <hr />
      <Dayselector value={date} disabledDates={disabledDates} onChange={(value) => onChangeDate(value)} />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
        </div>
        <hr />
        <div className="p-4 flex flex-row items-center justify-betweenfont-semiboldtext-lg">
          <div>Total</div>
          <div>₹ {totalPrice}</div>
          </div>
          </div>
          );
        }

export default ListingReservation;