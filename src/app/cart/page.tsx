'use client';

import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import getReservations from '../actions/getReservations';

type Reservation = {
  BoatId: string;
  BoatName: string;
  BookingDate: any;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: string;
};


const Cart = () => {
  const [user] = useAuthState(auth);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);

  const fetchReservations = async () => {
    if (user) {
      try {
        const reservationsData = await getReservations(user.email);
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
    <div className='pt-28'>
      {user ? (
        <>
          {user.email}
          {reservations !== null ? ( // Check for null
            <div>
              <h2>Your Reservations:</h2>
              <ul>
                {reservations.map((reservation, index) => (
                  <li key={index}>
                    Reservation ID: {reservation.BoatName}<br />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>Loading reservations...</div>
          )}
        </>
      ) : (
        <div>Please login to see your cart</div>
      )}
    </div>
  );
};

export default Cart;
