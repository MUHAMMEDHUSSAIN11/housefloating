'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import getReservationById from '../actions/getReservationById';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import TripsClient from './TripsClient';
import { Timestamp } from 'firebase/firestore';
import GpayBanner from '../components/Misc/Banner';
import Spinner from '../components/Misc/Spinner';



interface Reservation {
  ReservationId : string;
  BoatId: string;
  BoatName: string;
  BookingDate: Timestamp;
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
};

const CartPage = () => {
  const [user] = useAuthState(auth);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [isLoading,setIsLoading] = useState(false);

  const fetchReservations = async () => {
    try {
      const reservationsData = user ? await getReservationById(user.email) : null;
      setReservations(reservationsData || []); 
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
  <div className="pt-28">
      {isLoading ? (<Spinner /> ) : user && reservations ? (
        <ClientOnly>
          <TripsClient reservations={reservations} />
          <GpayBanner />
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
