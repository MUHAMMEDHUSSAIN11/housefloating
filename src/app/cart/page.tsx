'use client';

import React, { useEffect, useState } from 'react';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import TripsClient from './TripsClient';
import Spinner from '../components/Misc/Spinner';
import useAuth from '../hooks/useAuth';
import HandleGetOnlineBookings from '../actions/OnlineBookings/HandleGetOnlineBookings';

export interface Reservation {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BoatTitle: string;
  BookingDate: string; // Updated to string as per API
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: number;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
  UserId: string;
  BoatOwnerPhoneNumber?: string;
  CreatedOn?: string;
}


const CartPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      if (user) {
        const bookingsData = await HandleGetOnlineBookings();

        // Map the onlineBookings API response to the Reservation interface expected by TripsClient
        const formattedReservations = bookingsData?.map((booking: any) => ({
          ReservationId: String(booking.bookingId),
          BoatId: String(booking.boatId),
          BoatName: booking.boatName || 'Boat',
          BoatTitle: booking.boatName || 'Boat',
          BookingDate: booking.tripDate, // String from API
          Contactnumber: booking.guestContactNumber,
          Email: user.email,
          HeadCount: booking.adultCount,
          MinorCount: booking.childCount,
          Mode: booking.cruiseType || 'NightStay',
          Price: booking.price,
          Category: booking.boatCategoryName || '',
          Status: booking.bookingStatus || 'Booked',
          Image: '/placeholder-boat.jpg',
          UserId: String(user.id),
        }));

        setReservations(formattedReservations || []);
      } else {
        setReservations([]);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchReservations();
    }
  }, [user]);


  return (
    <div className="pt-56 md:pt-32 ">
      {isLoading ? (<Spinner />) : user && reservations ? (
        <ClientOnly>
          <TripsClient reservations={reservations} />
        </ClientOnly>
      ) : (
        <ClientOnly>
          <EmptyState title="Not Logged in!" subtitle="Please log in to see reservations!" />
        </ClientOnly>
      )}
    </div>
  );
};

export default CartPage;
