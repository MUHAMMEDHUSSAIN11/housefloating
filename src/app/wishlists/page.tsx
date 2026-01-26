'use client';
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import HandleGetWhishlist, { WishlistItem } from '../actions/Whishlist/HandleGetWhishlist';
import Handlecreatewhishlist from '../actions/Whishlist/HandleCreateWhilshlist';
import * as NProgress from "nprogress";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';

const Page = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const handlePush = (boatId: number) => {
    router.push(`/listings/${boatId}`);
    NProgress.start();
    NProgress.done();
  };

  const fetchWishlistData = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await HandleGetWhishlist();
        if (response && response.items) {
          setWishlistItems(response.items);
        } else {
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleRemoveFromWishlist = async (boatId: number) => {
    if (!user) return;

    try {
      // Optimistically update UI
      setWishlistItems(prev => prev.filter(item => item.boatId !== boatId));

      const success = await Handlecreatewhishlist(boatId, Number(user.id));

      if (success) {
        toast('Removed from wishlist', {
          icon: '💔',
        });
      } else {
        toast.error('Failed to remove from wishlist');
        // Revert update
        fetchWishlistData();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Something went wrong');
      fetchWishlistData();
    }
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
    <div className="min-h-screen bg-white pt-40 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Wishlists</h1>
            <p className="text-gray-600">{wishlistItems.length} saved boats</p>
          </div>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} onClick={() => handlePush(item.boatId)} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={item.boat.imageUrl || '/placeholder-boat.jpg'}
                      alt={item.boat.boatName || 'Boat'}
                      fill
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <button
                      className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.boatId);
                      }}
                    >
                      <Heart
                        className="h-6 w-6 text-red-500 fill-red-500"
                      />
                    </button>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2 flex-1">
                        {item.boat.boatName || 'Unnamed Boat'}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {item.boat.category} • {item.boat.bedroomCount} Bedroom{item.boat.bedroomCount !== 1 ? 's' : ''}
                    </p>

                    <p className="text-gray-900">
                      <span className="font-semibold text-blue-600">View Boat</span>
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
