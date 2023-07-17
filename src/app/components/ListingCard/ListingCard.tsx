'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import Button from '../Misc/Button'

// this component is used to display items in boats page

interface FirestoreListing {
  id: string
  bathroomCount: number
  category: string
  description: string
  guestCount: number
  imageSrc: string
  roomCount: number
  title: string
  price: number
}

interface ListingCardProps {
  data: FirestoreListing
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;

}


const ListingCard: React.FC<ListingCardProps> = ({ data, onAction, disabled, actionId = "", actionLabel}) => {
  const router = useRouter();


  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      
      if (disabled) {
        return;
      }
      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  return (
    <div onClick={() => router.push(`/listings/${data.id}`)} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image fill className="object-cover h-full w-full group-hover:scale-110 transition" src={data.imageSrc} alt="Listing" />
        </div>
        <div className="font-semibold text-lg">
          {data.title}, {data.description}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {data.price}
          </div>
            <div className="font-light"> per night</div>
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel} 
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ListingCard