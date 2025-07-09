// 'use client'

// import React, { useCallback, useEffect, useState } from 'react'
// import Image from 'next/image'
// import Button from '../Misc/Button'
// import { Timestamp } from 'firebase/firestore'
// import { useRouter } from 'next/navigation'
// import * as NProgress from "nprogress";
// import { amount } from '@/app/enums/enums'
// import { Heart } from 'lucide-react'
// import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '@/app/firebase/clientApp'
// import useLoginModal from '@/app/hooks/useLoginModal'
// import checkWishlistStatus from '@/app/actions/checkWishlistStatus'
// import createWishlist from '@/app/actions/createWishlist'
// import toast from 'react-hot-toast'
// import removeWishlist from '@/app/actions/removeWishlist'
// import { User } from 'firebase/auth'

// // this component is used to display items in boats page

// export interface FirestoreListing {
//   id: string,
//   docId: string,
//   bathroomCount: number,
//   category: string,
//   description: string,
//   guestCount: number,
//   images: string[],
//   roomCount: number,
//   title: string,
//   price: number,
//   reservations: Timestamp[],
//   guestTitle: string,
//   dayCruisePrice: number,
// }

// interface ListingCardProps {
//   data: FirestoreListing
//   onAction?: (id: string) => void;
//   disabled?: boolean;
//   actionLabel?: string;
//   actionId?: string;
// }


// const ListingCard: React.FC<ListingCardProps> = ({ data, onAction, disabled, actionId = "", actionLabel }) => {
//   const router = useRouter();
//   const loginModal = useLoginModal();
//   const [user] = useAuthState(auth);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);


//   const handlePush = () => {
//     //start done needs to be rechecked
//     router.push(`/listings/${data.docId}`);
//     NProgress.start();
//     NProgress.done();
//   };

//   const strikeThroughPrice = Math.round(data.price * amount.offerPrice);
//   const offerPrice = data.price;

//   const handleCancel: any = useCallback(
//     (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.stopPropagation();

//       if (disabled) {
//         return;
//       }
//       onAction?.(actionId)
//     }, [disabled, onAction, actionId]);


//   // Check if item is already in user's wishlist
//   useEffect(() => {
//     const fetchWishlistStatus = async () => {
//       try {
//         const querySnapshot = await checkWishlistStatus(user, data);
//         if (querySnapshot && typeof querySnapshot !== 'boolean') {
//           setIsWishlisted(!querySnapshot.empty);
//         } else {
//           setIsWishlisted(false);
//         }
//       } catch (error) {
//         console.error('Error fetching wishlist status:', error);
//         setIsWishlisted(false);
//       }
//     };

//     fetchWishlistStatus();
//   }, [user, data.docId]); // Re-run when user or boat ID changes

//   // Handle adding to wishlist
//   const handleAddToWishlist = async (boatData: FirestoreListing, user: User) => {
//     if (isLoading) return false;

//     setIsLoading(true);
//     try {
//       const success = await createWishlist(boatData, user);

//       if (success) {
//         setIsWishlisted(true);
//         toast.success('Added to wishlist!');
//         return true;
//       } else {
//         toast.error('Failed to add to wishlist. Please try again.');
//         return false;
//       }
//     } catch (error) {
//       console.error('Error in handleAddToWishlist:', error);
//       toast.error('Failed to add to wishlist. Please try again.');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle removing from wishlist
//   const handleRemoveFromWishlist = async (boatData: FirestoreListing, user: User) => {
//     if (isLoading) return false;

//     setIsLoading(true);
//     try {
//       const success = await removeWishlist(boatData.docId, user.uid);

//       if (success) {
//         setIsWishlisted(false);
//         toast.success('Removed from wishlist!');
//         return true;
//       } else {
//         toast.error('Item not found in wishlist.');
//         setIsWishlisted(false); // Reset state if not found
//         return false;
//       }
//     } catch (error) {
//       console.error('Error in handleRemoveFromWishlist:', error);
//       toast.error('Failed to remove from wishlist. Please try again.');
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle heart icon click
//   const handleHeartClick = async (e: any) => {
//     e.stopPropagation(); // Prevent triggering the parent onClick

//     if (isLoading) return; // Prevent multiple clicks while loading

//     if (!user) {
//       loginModal.onOpen();
//       return;
//     }

//     // Toggle wishlist status
//     if (isWishlisted) {
//       // Remove from wishlist
//       await handleRemoveFromWishlist(data, user);
//     } else {
//       // Add to wishlist
//       await handleAddToWishlist(data, user);
//     }
//   };

//   return (
//     <div onClick={() => handlePush()} className="col-span-1 cursor-pointer group relative">
//       {/* Heart Icon */}
//       <div
//         className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//         onClick={handleHeartClick}
//       >
//         <Heart
//           size={20}
//           className={`transition ${isWishlisted
//             ? 'text-red-500 fill-red-500'
//             : 'text-gray-700 hover:text-red-500 hover:fill-red-500'
//             } ${isLoading ? 'animate-pulse' : ''}`}
//         />
//       </div>

//       <div className="flex flex-col gap-2 w-full">
//         <div className="aspect-square w-full relative overflow-hidden rounded-xl">
//           <Image
//             fill
//             className="object-cover h-full w-full group-hover:scale-110 transition"
//             src={data.images[0]}
//             alt="Listing"
//           />
//         </div>
//         <div className="font-semibold text-lg">
//           {data.guestTitle},{data.roomCount} Bedrooms
//         </div>
//         <div className='flex flex-row items-center gap-1'>
//           <div className='font-semibold'>{data.category}</div>
//         </div>
//         <div className="flex flex-row items-center gap-1">
//           <div className="font-light">Starting From</div>
//           <div className="text-gray-600 line-through">₹ {strikeThroughPrice} /-</div>
//         </div>
//         <div className='flex flex-row items-center gap-1'>
//           <div className="font-semibold">₹ {offerPrice} /-</div>
//         </div>
//         {onAction && actionLabel && (
//           <Button
//             disabled={disabled}
//             small
//             label={actionLabel}
//             onClick={handleCancel}
//           />
//         )}
//       </div>
//     </div>

//   )
// };

// export default ListingCard;
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
import { User } from 'firebase/auth'
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
  const offerPrice = useMemo(() => data.price, [data.price]);

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

  // Handle adding to wishlist
  const handleAddToWishlist = async (boatData: FirestoreListing, user: User) => {
    if (isLoading) return false;

    setIsLoading(true);
    try {
      const success = await createWishlist(boatData, user);

      if (success) {
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
        return true;
      } else {
        toast.error('Failed to add to wishlist. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error in handleAddToWishlist:', error);
      toast.error('Failed to add to wishlist. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing from wishlist
  const handleRemoveFromWishlist = async (boatData: FirestoreListing, user: User) => {
    if (isLoading) return false;

    setIsLoading(true);
    try {
      const success = await removeWishlist(boatData.docId, user.uid);

      if (success) {
        setIsWishlisted(false);
        toast.success('Removed from wishlist!');
        return true;
      } else {
        toast.error('Item not found in wishlist.');
        setIsWishlisted(false);
        return false;
      }
    } catch (error) {
      console.error('Error in handleRemoveFromWishlist:', error);
      toast.error('Failed to remove from wishlist. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

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
      toast.success('Removed from wishlist!');
    } else {
      toast.success('Added to wishlist!');
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
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
          
          {/* Smaller text and spacing */}
          <div className="font-semibold text-sm">
            {data.guestTitle},{data.roomCount} Bedrooms
          </div>
          
          <div className='flex flex-row items-center gap-1'>
            <div className='font-medium text-xs text-gray-600'>{data.category}</div>
          </div>
          
          <div className="flex flex-row items-center gap-1">
            <div className="font-light text-xs">Starting From</div>
            <div className="text-gray-500 line-through text-xs">₹ {strikeThroughPrice} /-</div>
          </div>
          
          <div className='flex flex-row items-center gap-1'>
            <div className="font-semibold text-sm">₹ {offerPrice} /-</div>
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

export default ListingCard;