'use client';

import React, { useCallback, useRef } from 'react';
import Container from '../components/Misc/Container';
import Heading from '../components/Misc/Heading';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import Card from './Card';
import CancelReservation from '../actions/cancelReservation';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Reservation } from './page';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';

interface TripsClientProps {
  reservations: Reservation[] | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ reservations }) => {
  const router = useRouter();
  const dtoast = useRef(null);

  const onConfirm = useCallback((reservation: Reservation) => {
    CancelReservation(reservation)
    router.push('/cart');
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
      acceptClassName: ' p-3 rounded-md',
      rejectClassName: ' p-3 rounded-md',
    });
  }

  return (
    <Container>
      <Heading title="Trips" subtitle="Where you've been and where you're going" />
      {reservations !== null ? (
        <div className="mt-10 w-full lg:w-5/6 ">
          {reservations.map((reservation, index) => (
            <div key={index} className="mb-4">
              <Card key={index} details={reservation} actionLabel="Cancel booking"
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
