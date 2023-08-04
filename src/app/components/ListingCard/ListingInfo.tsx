'use client';

import React from 'react'

interface ListingInfoProps {
    category : string,
    roomCount : number,
    description : string,
    guestCount : number,
    bathroomCount : number,
}

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
    </div>
  )
}

export default ListingInfo