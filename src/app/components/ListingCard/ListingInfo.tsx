'use client';

import React, { useState, useEffect } from 'react'
import Counter from '../Inputs/Counter';
import { BoatCruisesId, BookingType } from '@/app/enums/enums';

interface ListingInfoProps {
  category: string;
  roomCount: number;
  bathroomCount: number;
  setAdultCount: (value: number) => void;
  adultCount: number;
  travelMode: number;
  maxAdultCount: number;
  minAdultCount: number;
  title: string;
  boardingPoint: string;
  bookingTypeId?: number | null;
  roomCountState: number;
  availableRoomCount?: number;
  setRoomCount?: (value: number) => void;
  minRoomCount: number;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ maxAdultCount,
  bathroomCount, roomCount, setAdultCount, availableRoomCount, travelMode,category,
  adultCount, minAdultCount, title, boardingPoint, bookingTypeId, roomCountState, setRoomCount, minRoomCount }) => {
  const isDayCruise = travelMode === BoatCruisesId.dayCruise
  const isSharing = bookingTypeId === BookingType.sharing;
  const currentMaxAdults = isSharing
    ? (roomCountState * maxAdultCount)
    : isDayCruise
      ? maxAdultCount
      : (roomCountState * 3);
  const currentMinAdults = (isDayCruise && !isSharing) ? minAdultCount : 1;

  const [roomError, setRoomError] = useState<'min' | 'max' | null>(null);
  const [adultError, setAdultError] = useState<'min' | 'max' | null>(null);

  useEffect(() => {
    if (roomError) {
      const timer = setTimeout(() => setRoomError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [roomError]);

  useEffect(() => {
    if (adultError) {
      const timer = setTimeout(() => setAdultError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [adultError]);

  return (
    <div className='flex flex-col gap-7 px-1'>
      <div className='flex flex-col gap-2'>
        <div className="text-xl font-semibold">{title},{boardingPoint}</div>
        <div className="text-sm flex flex-row items-center gap-2">
          <div>{roomCount} Bedrooms</div>•
          <div>{bathroomCount} Bathrooms</div>•
          <div>{category}</div>
        </div>
      </div>
      <hr className='border border-gray-300' />

      {setRoomCount && roomCountState !== undefined && !(isDayCruise && !isSharing) && (
        <div className=''>
          <Counter
            onChange={(value) => {
              setRoomError(null);
              setRoomCount(value);
            }}
            min={isSharing ? 1 : minRoomCount}
            max={isSharing ? availableRoomCount : roomCount}
            value={roomCountState}
            title="Number of Rooms"
            subtitle="Select rooms required"
            onLimitReached={(type) => setRoomError(type)}
          />
          {roomError === 'min' && (
            <div className={`text-sm text-red-500 mt-1 ${isSharing && 'hidden'}`}>
              This boat requires {isSharing ? 1 : minRoomCount} minimum rooms to operate.
            </div>
          )}
          {roomError === 'max' && (
            <div className='text-sm text-red-500 mt-1'>
              Maximum room count reached.
            </div>
          )}
        </div>
      )}

      <div className=''>
        <Counter
          onChange={(value) => {
            setAdultError(null);
            setAdultCount(value);
          }}
          min={currentMinAdults}
          max={currentMaxAdults}
          value={adultCount}
          title="Number of Adults"
          subtitle="Ages 10 and above"
          onLimitReached={(type) => setAdultError(type)}
        />
        {adultError === 'max' && (
          <div className='text-sm text-red-500 mt-1'>Maximum adult count reached</div>
        )}
        {adultError === 'min' && (
          <div className='text-sm text-red-500 mt-1'>Minimum adult count reached</div>
        )}
      </div>

      <hr className='border border-gray-300' />
    </div>
  )
}

export default ListingInfo