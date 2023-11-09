'use client';

import UpdateStatusToConfirmed from '@/app/actions/updatetoConfirmed';
import { DocumentData } from 'firebase/firestore';
import React from 'react'
import { BookingStatus } from '../enums/enums';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// interface StoreReservation {
//     BoatId: string,
//     BoatName: string,
//     BookingDate: any,
//     Category: string,
//     Contactnumber: string,
//     Email: string,
//     HeadCount: number,
//     MinorCount: number,
//     Mode: string,
//     Payment: boolean,
//     Price: string,
//     Status: string,
// }

interface DataProps {
    reservation: DocumentData;
}

const AdminTable: React.FC<DataProps> = ({ reservation }) => {
    const router = useRouter();

  function formatDate(date: any) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toDate().toLocaleDateString(options);
    }

  const UpdatingConfirmation = async (reservation : any) => {
      if(reservation.Status == BookingStatus.Cancelled){
        toast.error('Reservation is already Cancelled');
        return;
      }
      await UpdateStatusToConfirmed(reservation.BoatId,reservation.BookingDate);
      router.refresh();
  }
  
    return (
        <tr className="border-b">
      <td className="px-4 py-2 text-black">{reservation.BoatName}</td>
      <td className="px-4 py-2 text-black">{reservation.Category}</td>
      <td className="px-4 py-2 text-black">{reservation.Contactnumber}</td>
      <td className="px-4 py-2 text-black">{reservation.HeadCount}</td>
      <td className="px-4 py-2 text-black">{reservation.MinorCount}</td>
      <td className="px-4 py-2 text-black">{reservation.Price}</td>
      <td className="px-4 py-2 text-black">{reservation.Status}</td>
      <td className="px-4 py-2 text-black">{formatDate(reservation.BookingDate)}</td>
      <td className="px-4 py-2">
            <a href="#" onClick={() => UpdatingConfirmation(reservation)} className="text-blue-600 hover:underline">
              Update
            </a>
          </td>
        </tr>
      );
  };
  
  export default AdminTable;