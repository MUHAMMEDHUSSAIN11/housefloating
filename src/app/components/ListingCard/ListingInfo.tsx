'use client';

import React from 'react'
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
  bathroomCount, roomCount, setAdultCount, availableRoomCount,travelMode,
  adultCount, minAdultCount, title, boardingPoint, bookingTypeId, roomCountState, setRoomCount, minRoomCount }) => {
  const isDayCruise = travelMode === BoatCruisesId.dayCruise
  const isSharing = bookingTypeId === BookingType.sharing;
  const currentMaxAdults = isSharing
    ? (roomCountState * maxAdultCount)
    : isDayCruise
    ? maxAdultCount
    : (roomCountState * 3);
  const currentMinAdults = (isSharing || isDayCruise) ? minAdultCount : 1;

  return (
    <div className='flex flex-col gap-7 px-1'>
      <div className='flex flex-col gap-2'>
        <div className="text-xl font-semibold">{title},{boardingPoint}</div>
        <div className="text-sm flex flex-row items-center gap-2">
          <div>{roomCount} Bedrooms</div>•
          <div>{bathroomCount} Bathrooms</div>
        </div>
      </div>
      <hr className='border border-gray-300' />

      { setRoomCount && roomCountState !== undefined && !(isDayCruise && !isSharing) && (
        <div className=''>
          <Counter
            onChange={(value) => {
              setRoomCount(value);
            }}
            min={isSharing?1 :minRoomCount}
            max={isSharing ? availableRoomCount : roomCount}
            value={roomCountState}
            title="Number of Rooms"
            subtitle="Select rooms required"
          />
          {minRoomCount === roomCount
          ? (isSharing ? roomCountState === 1 : roomCountState === minRoomCount) && (
          <div className='text-sm text-red-500 mt-1'>This boat requires {roomCountState} minimum rooms to operate.</div>
          )
          :
          <>
          {(isSharing ? roomCountState === availableRoomCount : roomCountState === roomCount) && (
          <div className='text-sm text-red-500 mt-1'>This boat allows a maximum of {roomCountState} rooms.</div>
          )}
          {(isSharing ? roomCountState === 1 : roomCountState === minRoomCount) && (
          <div className='text-sm text-red-500 mt-1'>This boat requires {roomCountState} minimum rooms to operate.</div>
          )}
          </>}
        </div>
      )}

      <div className=''>
        <Counter
          onChange={(value) => setAdultCount(value)}
          min={currentMinAdults}
          max={currentMaxAdults}
          value={adultCount}
          title="Number of Adults"
          subtitle="Ages 10 and above"
        />
        {adultCount === currentMaxAdults && (
          <div className='text-sm text-red-500 mt-1'>Maximum adult count reached</div>
        )}
      </div>

      <hr className='border border-gray-300' />
    </div>
  )
}

export default ListingInfo