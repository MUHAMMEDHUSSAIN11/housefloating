'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import Counter from '../Inputs/Counter';


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
}

const Map = dynamic(() => import('../Misc/Map'), {
  ssr: false
});


const coordinates = [9.5008, 76.3443]
const ListingInfo: React.FC<ListingInfoProps> = ({ category, travelMode, bathroomCount, description, guestCount, roomCount, setAdultCount, setChildCount, adultCount, childCount }) => {

  let adultCounterMax = 0;
  if (travelMode === "DayCruise") {
    adultCounterMax = guestCount * 10;
  } else if (travelMode === "Overnight") {
    adultCounterMax = guestCount * 3;
  }

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className="text-xl flex flex-row items-center gap-2">
          <div>{guestCount} Guests</div>
          <div>{roomCount} Bedrooms</div>
          <div>{bathroomCount} Bathrooms</div>
        </div>
      </div>
      <hr />
      <div className=''>
        <Counter onChange={(value) => setAdultCount(value)} min={guestCount} max={adultCounterMax} value={adultCount} title="Number of Adults" subtitle="How many you have?" />
      </div>
      <div className=''>
        <Counter onChange={(value) => setChildCount(value)}  value={childCount} title="Number of Childrens" subtitle="How many you have?" />
      </div>
      <hr />
      <Map center={coordinates} />
      <hr />
    </div>

  )
}

export default ListingInfo