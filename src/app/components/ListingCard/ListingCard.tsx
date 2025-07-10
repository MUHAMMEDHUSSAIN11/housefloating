'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Misc/Button'
import { Timestamp } from 'firebase/firestore'
import { amount } from '@/app/enums/enums'
import { Heart } from 'lucide-react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/clientApp'
import useLoginModal from '@/app/hooks/useLoginModal'
import checkWishlistStatus from '@/app/actions/checkWishlistStatus'
import createWishlist from '@/app/actions/createWishlist'
import toast from 'react-hot-toast'
import removeWishlist from '@/app/actions/removeWishlist'
import { useDebouncedWishlist } from '@/app/hooks/useDebouncedWishlist' // Import the hook

export interface FirestoreListing {
  id: string,
  docId: string,
  bathroomCount: number,
  category: string,
  description: string,
  guestCount: number,
  images: string[],
  roomCount: number,
  title: string,
  price: number,
  reservations: Timestamp[],
  guestTitle: string,
  dayCruisePrice: number,
}

interface ListingCardProps {
  data: FirestoreListing
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = React.memo(({ data, onAction, disabled, actionId = "", actionLabel }) => {
  const loginModal = useLoginModal();
  const [user] = useAuthState(auth);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedWishlistOperation = useDebouncedWishlist(300); // 300ms debounce

  const strikeThroughPrice = useMemo(() => Math.round(data.price * amount.offerPrice), [data.price]);
  const offerPrice = useMemo(() => data.dayCruisePrice, [data.dayCruisePrice]);

  const handleCancel: any = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId)
    }, [disabled, onAction, actionId]);

  // Check if item is already in user's wishlist
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const querySnapshot = await checkWishlistStatus(user, data);
        if (querySnapshot && typeof querySnapshot !== 'boolean') {
          setIsWishlisted(!querySnapshot.empty);
        } else {
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error('Error fetching wishlist status:', error);
        setIsWishlisted(false);
      }
    };

    fetchWishlistStatus();
  }, [user, data.docId]);



  // Handle heart icon click with debouncing
  const handleHeartClick = useCallback(async (e: any) => {
    e.stopPropagation();

    if (isLoading) return;

    if (!user) {
      loginModal.onOpen();
      return;
    }

    // Optimistically update UI and show immediate feedback
    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);

    // Show immediate toast feedback
    if (previousState) {
      toast('Removed from wishlist', {
        icon: '💔',
      });
    } else {
      toast('Added to wishlist', {
        icon: '❤️',
      });
    }

    // Debounce the actual API call
    debouncedWishlistOperation(
      isWishlisted ? 'remove' : 'add',
      data.docId,
      async () => {
        setIsLoading(true);
        try {
          let success;
          if (previousState) {
            success = await removeWishlist(data.docId, user.uid);
          } else {
            success = await createWishlist(data, user);
          }

          if (!success) {
            // Revert optimistic update on failure
            setIsWishlisted(previousState);
            toast.error('Operation failed. Please try again.');
          }
        } catch (error) {
          // Revert optimistic update on error
          setIsWishlisted(previousState);
          toast.error('Operation failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    );
  }, [isWishlisted, isLoading, user, loginModal, debouncedWishlistOperation, data]);


  return (
    <div className="col-span-1 group relative">
      {/* Heart Icon */}
      <div
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleHeartClick}
      >
        <Heart
          size={16}
          className={`transition ${isWishlisted
            ? 'text-red-500 fill-red-500'
            : 'text-gray-700 hover:text-red-500 hover:fill-red-500'
            } ${isLoading ? 'animate-pulse' : ''}`}
        />
      </div>

      <Link href={`/listings/${data.docId}`} className="block cursor-pointer">
        <div className="flex flex-col gap-1.5 w-full">
          {/* Smaller aspect ratio for more compact cards */}
          <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg">
            <Image
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition"
              src={data.images[0]}
              alt="Listing"
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={false}
            />
          </div>

          {/* Smaller text and spacing */}
          <div className="font-semibold text-md">
            {data.guestTitle},{data.roomCount} Bedrooms
          </div>

          <div className='flex flex-row items-center gap-1'>
            <div className='font-medium text-sm text-gray-600'>{data.category}</div>
          </div>

          <div className="flex flex-row items-center gap-1">
            <div className="font-light text-sm">Starting From</div>
            <div className="text-gray-500 line-through text-xs">₹ {strikeThroughPrice} /-</div>
          </div>

          <div className='flex flex-row items-center gap-1'>
            <div className="font-semibold text-md">₹ {offerPrice} /-</div>
          </div>
        </div>
      </Link>

      {/* Action button outside Link to prevent nested interactive elements */}
      {onAction && actionLabel && (
        <div className="mt-2">
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        </div>
      )}
    </div>
  )
});
ListingCard.displayName = "ListingCard";
export default ListingCard;
