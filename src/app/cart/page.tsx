'use client';

import React, { useEffect, useState } from 'react';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import TripsClient from './TripsClient';
import Spinner from '../components/Misc/Spinner';
import useAuth from '../hooks/useAuth';
import HandleGetOnlineBookings from '../actions/OnlineBookings/HandleGetOnlineBookings';
import { BookingStatus } from '../enums/enums';

export interface BookingData {
  bookingId: number;
  boatId: number;
  boatName: string;
  boatCategoryId: number;
  boatCategoryName: string;
  guestName: string;
  imageUrl:string
  guestContactNumber: string;
  guestPlace: string | null;
  boardingPoint: string | null;
  tripDate: Date;
  bookingDate: string;
  bookingTypeId: number;
  bookingType: string;
  adultCount: number;
  childCount: number;
  cruiseTypeId: number;
  cruiseType: string;
  bookingStatus: BookingStatus;
  isVeg: boolean;
  isAdvancePaid: boolean;
  price: number;
  advanceAmount: number;
  balanceAmount: number;
  agent: string | null;
  notes: string | null;
  createdOn: string;
  createdBy: string;
  updatedOn: string | null;
  updatedBy: string | null;
  isShared: boolean;
  occupiedSlots: number;
  remainingSlots: number;
  totalSharedAmount: number;
  parentSharingRoomCount: number;
  sharedBookings: BookingData[]
}


const CartPage = () => {
  const { user } = useAuth();
  const [bookings, setbookings] = useState<BookingData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchbookings = async () => {
    try {
      if (user) {
        const bookingsData = await HandleGetOnlineBookings();
        setbookings(bookingsData || []);
      } else {
        setbookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchbookings();
    }
  }, [user]);


  return (
    <div className="pt-40 md:pt-36 ">
      {isLoading ? (<Spinner />) : user && bookings ? (
        <ClientOnly>
          <TripsClient bookings={bookings} />
        </ClientOnly>
      ) : (
        <ClientOnly>
          <EmptyState title="Not Logged in!" subtitle="Please log in to see bookings!" />
        </ClientOnly>
      )}
    </div>
  );
};

export default CartPage;
