'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { amount, BookingType } from '@/app/enums/enums'
import { Heart } from 'lucide-react'
import useLoginModal from '@/app/hooks/useLoginModal'
import FormatIndianCurrency from '../Misc/FormatIndianCurrency'
import useAuth from '@/app/hooks/useAuth'
import Handlecreatewhishlist from '@/app/actions/Whishlist/HandleCreateWhilshlist'
import HandleGetWhishlist from '@/app/actions/Whishlist/HandleGetWhishlist'
import toast from 'react-hot-toast'

interface BoatCardDetails {
  boatId: number;
  boatCategoryId: number;
  boatCategory: string;
  boatImage: string | null;
  bedroomCount: number;
  price: number;
  boatCode: string;
  guestCount: number | null;
  cruiseTypeId: number;
  cruiseType: string;
}

interface ListingCardProps {
  data: BoatCardDetails;
  startDate?: string | null;
  endDate?: string | null;
  cruiseTypeId?: number;
  bookingTypeId?: number;
}

const ListingCard: React.FC<ListingCardProps> = React.memo(({
  data,
  startDate,
  endDate,
  cruiseTypeId,
  bookingTypeId,
}) => {
  const loginModal = useLoginModal();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const strikeThroughPrice = useMemo(() => Math.round(data.price * amount.offerPrice), [data.price]);
  const offerPrice = useMemo(() => Math.round(data.price * amount.commissionPercentage), [data.price]);

  const imageUrl = !imageError && data.boatImage
    ? data.boatImage
    : '/placeholder-boat.jpg';

  const listingUrl = useMemo(() => {
    const params = new URLSearchParams();


    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (cruiseTypeId) params.append('cruiseTypeId', cruiseTypeId.toString());
    if(bookingTypeId) params.append('bookingTypeId',bookingTypeId?.toString());

    const queryString = params.toString();
    return `/listings/${data.boatId}${queryString ? `?${queryString}` : ''}`;
  }, [data.boatId, startDate, endDate, cruiseTypeId, bookingTypeId]);
  const isSharing = bookingTypeId === BookingType.sharing;

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const wishlistData = await HandleGetWhishlist();
        if (wishlistData && wishlistData.items) {
          const isFound = wishlistData.items.some(item => item.boatId === data.boatId);
          setIsWishlisted(isFound);
        }
      }
    };
    checkStatus();
  }, [user, data.boatId]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      loginModal.onOpen();
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const success = await Handlecreatewhishlist(data.boatId, Number(user.id));
      if (success) {
        setIsWishlisted(!isWishlisted);
        toast.success(!isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-span-1 group relative shadow-lg rounded-lg">
      <div
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleHeartClick}
      >
        <Heart
          size={16}
          className={`transition ${isWishlisted
            ? 'text-red-500 fill-red-500'
            : 'text-gray-700 hover:text-red-500'
            }`}
        />
      </div>

      <Link href={listingUrl} className="block cursor-pointer">
        <div className="flex flex-col w-full">
          <div className="aspect-4/3 w-full relative overflow-hidden rounded-t-lg bg-gray-200">
            <Image
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition"
              src={imageUrl}
              alt={`${data.boatCategory} Houseboat`}
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={false}
              onError={() => setImageError(true)}
            />
          </div>

          <div className='p-1'>
          <div className="font-semibold text-sm md:text-md mt-2 flex">
            {data.boatCategory} •
            {!isSharing?<div className='ml-1'>{data.bedroomCount} Bedroom{data.bedroomCount > 1 ? 's' : ''}</div>
            :<div className='ml-1'>SharingBoat</div>}
          </div>
            <div className='flex flex-col gap-1'>
              <div className="text-gray-700 text-xs">
                {data.guestCount || 2} Adult <span>·</span> {data.cruiseType}
              </div>
              <div className='flex justify-between items-center'>
              <div className='flex gap-1 items-center'>
                <div className="text-gray-500 line-through text-sm md:text-base">
                  ₹{FormatIndianCurrency(strikeThroughPrice)}
                </div>
                <div className="font-semibold text-gray-700 text-sm md:text-base">
                  <span className='font-medium'>₹</span>{FormatIndianCurrency(offerPrice)}
                  {isSharing && <span className='text-gray-700 text-xs'> /- bedroom</span>}
                </div>
              </div>
              <div className='flex flex-col bg-gray-200 p-1 justify-center items-center rounded-xl md:m-2'>
                <div className='text-[10px] md:text-xs text-gray-600'>2 Adult</div>
                <div className='text-[12px] md:text-sm text-gray-800'>₹{FormatIndianCurrency(12500)}</div>
              </div>
              </div>
            </div>
            </div>
        </div>
      </Link>
    </div>
  );
});

ListingCard.displayName = "ListingCard";
export default ListingCard;
