'use client';

import dynamic from 'next/dynamic';
import React from 'react'
import Counter from '../Inputs/Counter';
import { coordinates, TravelMode } from '@/app/enums/enums';


//This component is used for displaying individual item's details and counter

interface ListingInfoProps {
  category: string,
  roomCount: number,
  description: string,
  guestCount: number,
  bathroomCount: number,
  setAdultCount: (value: number) => void,
  setChildCount: (value: number) => void,
  adultCount: number,
  childCount: number,
  travelMode: string,
  dayGuestCountMax: number,
  nightGuestCountMax: number,
  dayGuestCountMin: number,
  nightGuestCountMin: number,
  title: string,
}

const Map = dynamic(() => import('../Misc/Map'), {
  ssr: false
});


const ListingInfo: React.FC<ListingInfoProps> = ({ title, dayGuestCountMax, nightGuestCountMax, travelMode,
  bathroomCount, description, guestCount, roomCount, setAdultCount,
  setChildCount, adultCount, childCount, dayGuestCountMin, nightGuestCountMin }) => {

  let adultCounterMax = 0;
  let adultCounterMin = 0;

  if (travelMode === TravelMode.DayCruise)
  {
        adultCounterMax = dayGuestCountMax;
        adultCounterMin = dayGuestCountMin;
  } else if (travelMode === TravelMode.OverNight) 
  {
        adultCounterMax = nightGuestCountMax;
        adultCounterMin = nightGuestCountMin;
  }

  return (
    <div className='col-span-4 flex flex-col gap-8 px-1'>
      <div className='flex flex-col gap-2'>
        <div className="text-xl flex flex-row items-center gap-2">
          <div>{title} </div>
        </div>
        <div className="text-xl flex flex-row items-center gap-2">
          <div>{guestCount} Guests</div>
          <div>{roomCount} Bedrooms</div>
          <div>{bathroomCount} Bathrooms</div>
        </div>
      </div>
      <hr />
      <div className=''>
        <Counter onChange={(value) => setAdultCount(value)} min={adultCounterMin} max={adultCounterMax} value={adultCount} title="Number of Adults" subtitle="Ages 12 and above" />
      </div>
      <div className=''>
        <Counter onChange={(value) => setChildCount(value)} value={childCount} max={roomCount} title="Number of Childrens" subtitle="Ages 5 to 11" />
      </div>
      <hr />
      {/* <div className='sm:hidden md:block'> */}
      <div className="hidden md:block">
        <Map center={coordinates} />
      </div>
      <hr />
    </div>

  )
}

export default ListingInfo