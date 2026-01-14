'use client';

import React, { useState, useEffect } from 'react';
// import useSWR from 'swr';
// import getListings, { Listing } from '../actions/getListings';
// import { updateListing } from '../actions/updateListings';
// import { deleteListing } from '../actions/deleteListing';
import isAuthority from '../actions/checkAuthority';
// import toast from 'react-hot-toast';
// import Image from 'next/image';
import useAuth from '../hooks/useAuth';

// Define a placeholder Listing interface if needed, or just use any for now since we are commenting out logic
interface Listing {
  id: string;
  title: string;
  category: string;
  guestTitle: string;
  price: number;
  dayCruisePrice: number;
  roomCount: number;
  bathroomCount: number;
  maxDayGuest: number;
  maxNightGuest: number;
  minDayGuest: number;
  minNightGuest: number;
  guestCount: number;
  adultAddonPrice: number;
  childAddonPrice: number;
  dayAdultAddOnPrice: number;
  dayChildAddOnPrice: number;
  images: string[];
  docId: string;
}

const ListingPage = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  // const [editingListing, setEditingListing] = useState<Listing | null>(null);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const { data: listings, error, isValidating, isLoading, mutate } = useSWR('listings', getListings, {
  //   refreshInterval: 10 * 60 * 1000,
  // });

  useEffect(() => {
    if (user?.id) {
      setIsAdmin(isAuthority(String(user.id)));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // const handleEdit = (listing: Listing) => {
  //   setEditingListing({ ...listing });
  // };

  // const handleSave = async () => {
  //   if (!editingListing) return;

  //   setIsSubmitting(true);
  //   try {
  //     const success = await updateListing(editingListing.docId, editingListing);
  //     if (success) {
  //       setEditingListing(null);
  //       mutate(); // Refresh the data
  //       toast.success('Listing updated successfully!');
  //     } else {
  //       toast.error('Failed to update listing');
  //     }
  //   } catch (error) {
  //     console.error('Error updating listing:', error);
  //     toast.error('Error updating listing');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleDelete = async (listingId: string) => {
  //   setIsSubmitting(true);
  //   try {
  //     const success = await deleteListing(listingId);
  //     if (success) {
  //       setShowDeleteConfirm(null);
  //       mutate(); // Refresh the data
  //       toast.success('Listing deleted successfully!');
  //     } else {
  //       toast.error('Failed to delete listing');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting listing:', error);
  //     toast.error('Error deleting listing');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleInputChange = (field: keyof Listing, value: any) => {
  //   if (!editingListing) return;
  //   setEditingListing({
  //     ...editingListing,
  //     [field]: value,
  //   });
  // };


  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-56 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin - Manage Listings</h1>
          <p className="mt-4 text-red-600">
            This page is currently under maintenance as we migrate to a new system.
            Please contact support if you need immediate assistance.
          </p>
        </div>
      </div>
    </div>
  );

  /*
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-56 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin - Manage Listings</h1>
          <p className="mt-2 text-gray-600">
            Total Listings: {listings?.length || 0}
          </p>
        </div>

        {/ * Listings Grid * /}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings?.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={listing.images[0] || '/placeholder-image.jpg'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {listing.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Category: {listing.category}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Guest Title: {listing.guestTitle}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>Price: ${listing.price}</div>
                  <div>Day Cruise: ${listing.dayCruisePrice}</div>
                  <div>Rooms: {listing.roomCount}</div>
                  <div>Bathrooms: {listing.bathroomCount}</div>
                  <div>Max Day: {listing.maxDayGuest}</div>
                  <div>Max Night: {listing.maxNightGuest}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(listing)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(listing.docId)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Listing</h2>
                  <button
                    onClick={() => setEditingListing(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingListing.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingListing.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Title</label>
                    <input
                      type="text"
                      value={editingListing.guestTitle}
                      onChange={(e) => handleInputChange('guestTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        value={editingListing.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day Cruise Price</label>
                      <input
                        type="number"
                        value={editingListing.dayCruisePrice}
                        onChange={(e) => handleInputChange('dayCruisePrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Count</label>
                      <input
                        type="number"
                        value={editingListing.roomCount}
                        onChange={(e) => handleInputChange('roomCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom Count</label>
                      <input
                        type="number"
                        value={editingListing.bathroomCount}
                        onChange={(e) => handleInputChange('bathroomCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Day Guests</label>
                      <input
                        type="number"
                        value={editingListing.maxDayGuest}
                        onChange={(e) => handleInputChange('maxDayGuest', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Night Guests</label>
                      <input
                        type="number"
                        value={editingListing.maxNightGuest}
                        onChange={(e) => handleInputChange('maxNightGuest', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Day Guests</label>
                      <input
                        type="number"
                        value={editingListing.minDayGuest}
                        onChange={(e) => handleInputChange('minDayGuest', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Night Guests</label>
                      <input
                        type="number"
                        value={editingListing.minNightGuest}
                        onChange={(e) => handleInputChange('minNightGuest', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                    <input
                      type="number"
                      value={editingListing.guestCount}
                      onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/ * ✅ Additional Fields * /}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adult Addon Price</label>
                      <input
                        type="number"
                        value={editingListing.adultAddonPrice}
                        onChange={(e) => handleInputChange('adultAddonPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Child Addon Price</label>
                      <input
                        type="number"
                        value={editingListing.childAddonPrice}
                        onChange={(e) => handleInputChange('childAddonPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day Adult Addon Price</label>
                      <input
                        type="number"
                        value={editingListing.dayAdultAddOnPrice}
                        onChange={(e) => handleInputChange('dayAdultAddOnPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day Child Addon Price</label>
                      <input
                        type="number"
                        value={editingListing.dayChildAddOnPrice}
                        onChange={(e) => handleInputChange('dayChildAddOnPrice', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingListing(null)}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/ * Delete Confirmation Modal * /}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  */
};

export default ListingPage;