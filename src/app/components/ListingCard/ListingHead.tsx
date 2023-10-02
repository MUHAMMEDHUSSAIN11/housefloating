'use client';

import React, { useState } from 'react';
import Heading from '../Misc/Heading';
import Image from 'next/image';

//This component is used for displaying individual listings images


interface ListingHeadProps {
  id: string;
  imageSrc: string[];
  title: string;
  roomCount: number;
  category: string;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  id,
  imageSrc,
  title,
  roomCount,
  category,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className='px-1'>
      <Heading title={title} subtitle={`${category} `} />
      <div className="aspect-square w-full h-[60vh] overflow-hidden rounded-xl relative group">
        <Image className="object-cover h-full w-full group-hover:scale-110 transition" src={imageSrc[currentIndex]} width={650} height={650} alt={title} />
      </div>
      {/* Thumbnail Images */}
      <div className="flex top-4 justify-center py-2">
        {imageSrc.map((img, slideIndex) => (
          <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`cursor-pointer ${slideIndex === currentIndex ? 'border-2 border-blue-500' : ''}`}>
            <Image
              src={img}
              alt={`${title} preview ${slideIndex}`}
              width={80}
              height={80}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ListingHead
