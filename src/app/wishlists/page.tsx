'use client';
import React, { useState, useEffect } from 'react';
import { Heart, } from 'lucide-react';
import getWishlists from '../actions/getWishLists';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import removeWishlist from '../actions/removeWishlist';
import * as NProgress from "nprogress";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WishList {
  BoatId: string,
  BoatName: string,
  CreatedOn: string,
  Image: string,
  Price: number,
  UserEmail: string,
  UserId: string
}

const Page = () => {
  const [wishlistItems, setWishlistItems] = useState<WishList[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();


   const handlePush = (boatId:string) => {
      //start done needs to be rechecked
      router.push(`/listings/${boatId}`);
      NProgress.start();
      NProgress.done();
    };


  useEffect(() => {
    if (user) {
      const fetchWishlistData = async () => {
        try {
          setLoading(true);
          const userWishlists = await getWishlists(user.uid);
          setWishlistItems(userWishlists);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchWishlistData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemoveFromWishlist = async (boatId: string) => {
    // Check if item exists in wishlist
    if (!wishlistItems.find(x => x.BoatId === boatId)) {
      // toast.error("Boat already removed from wishlists"); // Uncomment if you have toast
      return;
    }

    try {
      // Optimistically update UI first
      setWishlistItems(prev => prev.filter(item => item.BoatId !== boatId));

      // Then make the API call
      const success = await removeWishlist(boatId, user?.uid);

      if (success) {
        toast.success('Removed from wishlist!'); // Uncomment if you have toast
      } else {
        // Revert the optimistic update on failure
        const userWishlists = await getWishlists(user?.uid);
        setWishlistItems(userWishlists);
        // toast.error('Failed to remove from wishlist. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleRemoveFromWishlist:', error);
      // Revert the optimistic update on error
      const userWishlists = await getWishlists(user?.uid);
      setWishlistItems(userWishlists);
      // toast.error('Failed to remove from wishlist. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>              
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-white pt-40 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Wishlists</h1>
            <p className="text-gray-600">{wishlistItems.length} saved boats</p>
          </div>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No wishlists yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              When you find boats you love, you'll see them here. Start exploring and add boats to your wishlist.
            </p>
            <Link href="/houseBoats" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Start exploring
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.BoatId} onClick={() => handlePush(item.BoatId)} className="group cursor-pointer">
                <div className="relative mb-3">
                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.Image}
                      alt={item.BoatName}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Heart Icon */}
                    <button
                      className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.BoatId);
                      }}
                    >
                      <Heart
                        className="h-6 w-6 text-red-500 fill-red-500"
                      />
                    </button>

                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2 flex-1">
                        {item.BoatName}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      Wishlisted on {formatDate(item.CreatedOn)}
                    </p>

                    <p className="text-gray-900">
                      <span className="font-semibold">₹{item.Price}</span>
                      <span className="text-gray-600 font-normal"> per night</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;