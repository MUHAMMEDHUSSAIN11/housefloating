'use client';

import React, { useCallback, useState, useRef } from 'react';
import Container from '../components/Misc/Container';
import Heading from '../components/Misc/Heading';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import Card from './Card';
import CancelReservation from '../actions/cancelReservation';
import { useRouter } from 'next/navigation';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';


interface Reservation {
  ReservationId: string;
  BoatId: string;
  BoatName: string;
  BookingDate: any;
  Contactnumber: string;
  Email: string;
  HeadCount: number;
  MinorCount: number;
  Mode: string;
  Price: string;
  Payment: boolean;
  Category: string;
  Status: string;
  Image: string;
};

interface TripsClientProps {
  reservations: Reservation[] | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ reservations }) => {

  const router = useRouter();
  const dtoast = useRef(null);

  const onConfirm = useCallback((reservation: Reservation) => {
     CancelReservation(reservation)
     router.refresh();
  }, [router])

  const reject = () => {

  }

  const showConfirmationDialog = async (reservation: Reservation) => {
    confirmDialog({
      message: 'Proceed with booking cancellation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onConfirm(reservation),
      reject,
      acceptClassName: ' p-3 rounded-md', // Apply Tailwind CSS classes
      rejectClassName: ' p-3 rounded-md', // Apply Tailwind CSS classes
    });
  }

  return (
    <Container>
      <Heading title="Trips" subtitle="Where you've been and where you're going" />

      {reservations !== null ? (
        <div className="mt-10 w-full lg:w-3/4 ">
          {reservations.map((reservation, index) => (
            <div key={index} className="mb-4">
              <Card key={index} data={reservation} actionLabel="Cancel reservation"
                onAction={() => showConfirmationDialog(reservation)}
                disabled={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <ClientOnly>
            <EmptyState title="No reservations found" subtitle="Looks like you haven't booked any Boat!" />
          </ClientOnly>
        </>
      )}

      <Toast ref={dtoast} />
      <ConfirmDialog />

    </Container>
  );
};

export default TripsClient;
