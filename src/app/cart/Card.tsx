'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import Button from '../components/Misc/Button'
import { useRouter } from 'next/navigation'
import { IoBoat, IoCalendarNumberSharp, IoCard, IoCheckmarkCircle, IoPersonSharp, IoTime } from 'react-icons/io5'
import { BookingStatus } from '../enums/enums'

// this component is used to display items in Cart page

interface FirestoreListing {
  ReservationId : string;
  BoatId: string;
  BoatName: string;
  BookingDate: any;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: string;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
}

interface CardListingProps {
  data: FirestoreListing;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}



const Card: React.FC<CardListingProps> = ({ data, onAction, disabled, actionId = '', actionLabel }) => {
  const router = useRouter();

  function formatDate(date: any) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toDate().toLocaleDateString(undefined, options);
  }
  
  const handleCancel: any = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  return (
    <div className='shadow-lg rounded-lg font-sans'>
      <div className="flex flex-col md:flex-row ">
        <div onClick={() => router.push(`/listings/${data.BoatId}`)} className="aspect-square h-60  w-auto md:w-3/6 lg:4/6 relative overflow-hidden cursor-pointer rounded-xl">
          <Image fill className="object-cover h-auto w-auto group-hover:scale-110 transition" src={data.Image} alt="Listing" />
        </div>

        <div className='flex flex-col w-auto md:w-3/6 lg:w-4/6  gap-1 p-1'>
          <p className='font-semibold text-lg'>{data.BoatName}, {data.Category} Houseboat</p>
          <div className='flex items-center gap-2'> 
            <IoCalendarNumberSharp className="text-blue-600" size={20} />
            <p>Trip Date: <span className="font-semibold">{formatDate(data.BookingDate)}</span></p>
          </div>
          <div className='flex items-center gap-2'> 
          {data.Status == "Confirmed" ? (
            <IoCheckmarkCircle className="text-blue-600" size={20} />
          ):(
            <IoTime className="text-red-600" size={20} />
          )}
            <p >Status: <span className="font-semibold">{data.Status}</span> </p>
          </div>
          <div className='flex items-center gap-2'>
          <IoPersonSharp className="text-blue-600" size={20}/><p>Guests: {data.HeadCount + data.MinorCount}</p>
          </div>
          <div className='flex items-center gap-2'>
         <IoBoat className='text-blue-600' size={20}/> <p>Cruise: {data.Mode}</p>
         </div>
         <div className='flex items-center gap-2'>
         <IoCard className='text-blue-600' size={20}/>
          {data.Payment == false ? (
            <p>Payment: Not Paid</p>
          ):(
            <p>Payment: Completed</p>
          )}
          </div>
        </div>

        <div className='flex flex-col border-t md:border-l md:border-t-0 border-gray-300 w-auto md:w-2/6 lg:w-2/6 md:flex-row items-end p-1'>
          <div className='w-full md:w-64 pb-4 gap-2'>
            <div className='text-lg ml-32 md:ml-16 pb-2 items-center font-semibold'>Total  {data.Price}</div>
            <div className='pb-3'>
            <Button disabled={data.Status !== BookingStatus.Confirmed} label={"Pay Securely"} onClick={handleCancel}/>
          </div>
            {onAction && actionLabel && (
              <Button disabled={data.Status == BookingStatus.Cancelled} outline small label={actionLabel} onClick={handleCancel}/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card


