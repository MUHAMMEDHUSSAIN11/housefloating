'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/clientApp';
import useSWR from 'swr';
import EmptyState from '../components/Misc/EmptyState';
import AdminTable from './AdminTable';
import Spinner from '../components/Misc/Spinner';
import getReservations from '../actions/getReservations';
import isAuthority from '../actions/checkAuthority';
import { DocumentData } from 'firebase/firestore';
import { BookingStatus } from '../enums/enums';
import { useRouter } from 'next/navigation';
import UpdateStatusToApprovedID from '../actions/UpdateStatusToApprovedID';
import toast from 'react-hot-toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';



const Page = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const dtoast = useRef(null);

  const onConfirm = useCallback((reservation: DocumentData) => {
    UpdatingConfirmation(reservation)
    router.push('/admin');
  }, [router])

  const reject = () => {
  }

  const UpdatingConfirmation = async (reservation: DocumentData) => {
    if (reservation.Status == BookingStatus.Cancelled) {
      toast.error('Reservation is already Cancelled');
      return;
    }
    await UpdateStatusToApprovedID(reservation.id);
    router.refresh();
  }

  const showConfirmationDialog = async (reservation: DocumentData) => {
    confirmDialog({
      message: 'Are you sure want to confirm this Order?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onConfirm(reservation),
      reject,
      acceptClassName: ' p-3 rounded-md',
      rejectClassName: ' p-3 rounded-md',
    });
  }



  const { data: reservations, error, isValidating, isLoading } = useSWR('actions', getReservations, {
    refreshInterval: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (user?.uid) {
      setIsAdmin(isAuthority(user.uid));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (!user) {
    return <EmptyState title='Not logged in !!' subtitle='Please Log in as Administrator' />;
  }

  if (!isAdmin) {
    return <EmptyState title='Access Denied' subtitle='Play around other areas!' />;
  }

  if (isLoading || isValidating) {
    return <div><Spinner /></div>;
  }

  if (error || !reservations) {
    return <EmptyState showReset />;
  }

  return (
    <div className="pt-28 font-sans p-2">
      <h2 className='text-center text-2xl font-semibold'>Reservations</h2>
      <br />
      <div className="w-full overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-left text-white">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-4 py-2">Boat Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Contact Number</th>
              <th className='px-4 py-2'>Adults</th>
              <th className='px-4 py-2'>Children</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Booking Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.docs.map((listing) => (
              <AdminTable key={listing.id} reservation={listing.data()} reservationID={listing.id}  onAction={() => showConfirmationDialog(listing)} />
            ))}
          </tbody>
        </table>
      </div>
      <Toast ref={dtoast} />
      <ConfirmDialog />
    </div>
  );
};

export default Page;
