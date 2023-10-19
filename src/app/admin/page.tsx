'use client';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import useSWR from 'swr';
import getReservations from '../actions/getReservations';
import EmptyState from '../components/Misc/EmptyState';
import AdminTable from '../components/AdminReservations/AdminTable';

const Page = () => {
  const [user] = useAuthState(auth);
  const isAdmin = user?.uid === 'zX8nYa6x9yRPW8rXbrEkCd7cWXH2';

  const { data: reservations, error, isValidating, isLoading } = useSWR('actions', getReservations, {
    refreshInterval: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!isAdmin || !user) {
    return <div className='pt-28 font-sans font-semibold'>Not Authenticated</div>;
  }

  if (error || !reservations) {
    return <EmptyState showReset />;
  }

  if (reservations) {
    const reservationData = reservations.docs.map((doc) => doc.data());

    return (
      <div className="pt-28 font-sans p-2">
        <h2 className='text-center text-2xl font-semibold '>Reservations</h2>
        <br/>
        <div className="w-full overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-left text-white">
            <thead className="bg-blue-500">
              <tr>
                <th className="px-4 py-2">Boat Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Contact Number</th>
                <th className='px-4 py-2'>Adults</th>
                <th className='px-4 py-2'>Childrens</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Booking Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reservationData.map((listing) => (
                <AdminTable key={listing.id} reservation={listing} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Page;
