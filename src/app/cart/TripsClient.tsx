'use client';

import React, { useCallback, useRef } from 'react';
import Container from '../components/Misc/Container';
import Heading from '../components/Misc/Heading';
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/Misc/EmptyState';
import Card from './Card';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { BookingData } from './page';
import HandleCancelOnlineBooking from '../actions/OnlinePayments/HandleCancelOnlineBooking';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';

interface TripsClientProps {
  bookings: BookingData[] | null;
}

const TripsClient: React.FC<TripsClientProps> = ({ bookings }) => {
  const router = useRouter();
  const dtoast = useRef<Toast>(null);

  const onConfirm = useCallback(async (booking: BookingData) => {
    try {
      const cancelData = {
        bookingId: booking.bookingId,
        tripDate: booking.tripDate
      };

      const result = await HandleCancelOnlineBooking(cancelData);

      if (result) {
        dtoast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Booking cancelled successfully',
          life: 3000
        });

        // Refresh the page to update the bookings list
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      dtoast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to cancel booking. Please try again.',
        life: 3000
      });
    }
  }, [router])

  const reject = () => {

  }

  const showConfirmationDialog = async (bookings: BookingData) => {
    confirmDialog({
      message: 'Proceed with booking cancellation?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onConfirm(bookings),
      reject,
      acceptClassName: ' p-3 rounded-md',
      rejectClassName: ' p-3 rounded-md',
    });
  }

  return (
    <Container>
      <Heading title="Trips" subtitle="Where you've been and where you're going" />
      {bookings !== null ? (
        <div className="mt-10 w-full  2xl:w-5/6 ">
          {bookings.map((booking, index) => (
            <div key={index} className="mb-4">
              <Card key={index} details={booking} actionLabel="Cancel booking"
                onAction={() => showConfirmationDialog(booking)}
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
