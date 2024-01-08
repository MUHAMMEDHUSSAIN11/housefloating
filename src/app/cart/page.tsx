'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import getReservationById from '../actions/getReservationById';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import TripsClient from './TripsClient';
import { Timestamp } from 'firebase/firestore';



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

  const fetchReservations = async () => {
    if (user)
     {
      try {
        const reservationsData = await getReservationById(user.email);
        if (reservationsData) {
          setReservations(reservationsData);
        } else {
          setReservations([]); // Set as an empty array when there are no reservations
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

return (
  <div className="pt-28">
    {user ? (
        <ClientOnly>
        <TripsClient reservations={reservations} />
        </ClientOnly>
    ) : (
      <>
        <ClientOnly>
          <EmptyState title="Not Logged in!" subtitle="Please log in to see reservations!" />
        </ClientOnly>
      </>
    )}
  </div>
);
};

export default CartPage;
