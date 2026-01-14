'use client';

import React from 'react'
import Counter from '../Inputs/Counter';
import { BookingType } from '@/app/enums/enums';

interface ListingInfoProps {
  category: string;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  setAdultCount: (value: number) => void;
  setChildCount: (value: number) => void;
  adultCount: number;
  childCount: number;
  travelMode: number;
  maxAdultCount: number;
  maxchildCount: number;
  minAdultCount: number;
  title: string;
  boardingPoint: string;
  bookingTypeId?: number | null;
  roomCountState?: number;
  availableRoomCount?:number;
  setRoomCount?: (value: number) => void;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ maxAdultCount, maxchildCount,
  bathroomCount, guestCount, roomCount, setAdultCount,availableRoomCount,
  setChildCount, adultCount, childCount, minAdultCount, title, boardingPoint, bookingTypeId, roomCountState, setRoomCount }) => {

  const isSharing = bookingTypeId === BookingType.sharing;

  return (
    <div className='flex flex-col gap-7 px-1'>
      <div className='flex flex-col gap-2'>
        <div className="text-xl font-semibold">{title},{boardingPoint}</div>
        <div className="text-sm flex flex-row items-center gap-2">
          <div>{guestCount} Guests</div>.
          <div>{roomCount} Bedrooms</div>.
          <div>{bathroomCount} Bathrooms</div>
        </div>
      </div>
      <hr className='border border-gray-300'/>
      <div className=''>
        <Counter onChange={(value) => setAdultCount(value)} min={minAdultCount} max={maxAdultCount} value={adultCount} title="Number of Adults" subtitle="Ages 12 and above" />
        {adultCount === maxAdultCount && (
          <div className='text-sm text-red-500 mt-1'>Maximum adult count reached</div>
        )}
      </div>
      <div className=''>
        <Counter onChange={(value) => setChildCount(value)} min={0} value={childCount} max={maxchildCount} title="Number of Childrens" subtitle="Ages 5 to 11" />
        {childCount === maxchildCount && (
          <div className='text-sm text-red-500 mt-1'>Maximum child count reached</div>
        )}
      </div>
      {isSharing && setRoomCount && roomCountState !== undefined && (
        <div className=''>
          <Counter
            onChange={(value) => setRoomCount(value)}
            min={1}
            max={availableRoomCount}
            value={roomCountState}
            title="Number of Rooms"
            subtitle="Select rooms required"
          />
          {roomCountState === availableRoomCount && (
            <div className='text-sm text-red-500 mt-1'>Maximum room count reached</div>
          )}
        </div>
      )}
      <hr className='border border-gray-300'/>
    </div>
  )
}

export default ListingInfo