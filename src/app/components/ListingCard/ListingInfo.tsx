'use client';

import dynamic from 'next/dynamic';
import React from 'react'


//This component is used for displating individual items..

interface ListingInfoProps {
    category : string,
    roomCount : number,
    description : string,
    guestCount : number,
    bathroomCount : number,
}

const Map = dynamic(() => import('../Misc/Map'), { 
  ssr: false 
});


const coordinates = [9.5008,76.3443]
const ListingInfo:React.FC<ListingInfoProps> = ({category,bathroomCount,description,guestCount,roomCount}) => {
  return (
    <div className='col-span-4 flex flex-col gap-8'>
        <div className='flex flex-col gap-2'>
        <div className="text-xl flex flex-row items-center gap-2">
            <div>{guestCount} Guests</div>
            <div>{roomCount} Bedrooms</div>
            <div>{bathroomCount} Bathrooms</div>
          </div>
        </div>
        <hr/>
        <Map center={coordinates}/>
        <hr/>
    </div>

  )
}

export default ListingInfo