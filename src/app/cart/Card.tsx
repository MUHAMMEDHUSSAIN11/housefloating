'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import Button from '../components/Misc/Button';
import { useRouter } from 'next/navigation';
import { IoBoat, IoCalendarNumberSharp, IoCard, IoCheckmarkCircle, IoPersonSharp, IoTime } from 'react-icons/io5';
import { BookingStatus, amount } from '../enums/enums';
import MakeStripe from '../actions/MakeStripe';
import * as NProgress from "nprogress";
import { Timestamp } from 'firebase/firestore';



// this component is used to display items in Cart page

interface FirestoreListing {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BookingDate: Timestamp;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: number;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
}

interface CardListingProps {
  details: FirestoreListing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}



const Card: React.FC<CardListingProps> = ({ details, onAction, disabled, actionId = '', actionLabel }) => {
  const router = useRouter();

  function formatDate(date: any) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toDate().toLocaleDateString(undefined, options);
  }

  const advanceAmount = details.Price * amount.advance;
  const remainingAmount = details.Price * amount.remaining;


  const handlePush = () => {
    router.push(`/listings/${details.BoatId}`);
    NProgress.start();
    NProgress.done();
  };


  const handleCancel: any = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  return (
    <div className='shadow-lg rounded-lg font-sans'>
      <div className="flex flex-col md:flex-row ">
        <div onClick={() => handlePush()} className="aspect-square h-60  w-auto md:w-3/6 lg:4/6 relative overflow-hidden cursor-pointer rounded-xl">
          <Image fill className="object-cover h-auto w-auto group-hover:scale-110 transition" src={details.Image} alt="Listing" />
        </div>

        <div className='flex flex-col w-auto md:w-3/6 lg:w-4/6  gap-1 p-1'>
          <p className='font-semibold text-lg'>{details.BoatName}, {details.Category} Houseboat</p>
          <div className='flex items-center gap-2'>
            <IoCalendarNumberSharp className="text-blue-600" size={20} />
            <p>Trip Date: <span className="font-semibold">{formatDate(details.BookingDate)}</span></p>
          </div>
          <div className='flex items-center gap-2'>
            {details.Status == "Confirmed" || details.Status == "Approved" ? (
              <IoCheckmarkCircle className="text-blue-600" size={20} />
            ) : (
              <IoTime className="text-red-500" size={20} />
            )}
            <p >Status: <span className="font-semibold">{details.Status}</span> </p>
          </div>
          <div className='flex items-center gap-2'>
            <IoPersonSharp className="text-blue-600" size={20} /><p>Guests: {details.HeadCount + details.MinorCount}</p>
          </div>
          <div className='flex items-center gap-2'>
            <IoBoat className='text-blue-600' size={20} /> <p>Cruise: {details.Mode}</p>
          </div>
          <div className='flex items-center gap-2'>
            <IoCard className='text-blue-600' size={20} />
            {details.Payment == false ? (
              <p>Payment: Not Paid</p>
            ) : (
              <p>Payment: Completed</p>
            )}
          </div>
        </div>

        <div className='flex flex-col border-t md:border-l md:border-t-0 border-gray-300 w-auto md:w-2/6 lg:w-2/6 md:flex-row items-end p-4'>
          <div className='w-full md:w-64 pb-4 gap-2'>
            <div className='flex justify-between items-center mb-2'>
              <div className='text-lg font-semibold'>Total Price:</div>
              <div className='text-lg'>₹{details.Price}</div>
            </div>
            <div className='flex justify-between items-center mb-2'>
              <div className='text-lg font-semibold'>Advance Payment:</div>
              <div className='text-lg'>₹{advanceAmount}</div>
            </div>
            <div className='flex flex-col mb-2'>
              <div className='flex justify-between items-center'>
                <div className='text-lg font-semibold'>Remaining Amount:</div>
                <div className='text-lg'>₹{remainingAmount}</div>
              </div>
              <p className='text-sm text-gray-500'>To be paid at the time of check-in</p>
            </div>
            <div className='pb-3'>
              <Button disabled={details.Status !== BookingStatus.Approved} label={"Proceed to Payment"} onClick={() => MakeStripe(details)} />
            </div>
            {onAction && actionLabel && (
              <Button disabled={details.Status === BookingStatus.Cancelled} outline small label={actionLabel} onClick={handleCancel} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card


