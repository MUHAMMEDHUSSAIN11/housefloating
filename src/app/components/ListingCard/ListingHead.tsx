'use client';

import React from 'react'
import Heading from '../Misc/Heading';
import Image from 'next/image';



interface ListingHeadProps {
    id: string,
    imageSrc: string,
    title: string
    roomCount : number
}


const ListingHead:React.FC<ListingHeadProps> = ({id,imageSrc,title,roomCount}) => {
  return (
    <div className='pt-28'>
    <Heading title={title} subtitle={`${roomCount} Bedroom`} />
    <div className='w-full h-[60vh] overflow-hidden rounded-xl relative'>
        <Image alt="Boat Image" src={imageSrc} fill className='object-cover w-full'/>
    </div>
    </div>
  )
}

export default ListingHead