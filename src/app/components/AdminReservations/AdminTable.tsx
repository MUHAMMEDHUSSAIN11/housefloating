'use client';

import updateStatusToPaid from '@/app/actions/updatetoPaid';
import { DocumentData } from 'firebase/firestore';
import React from 'react'

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
    function formatDate(date: any) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toDate().toLocaleDateString(undefined, options);
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
            <a href="#" onClick={() => updateStatusToPaid(reservation.BoatId,reservation.BookingDate)} className="text-blue-600 hover:underline">
              Update
            </a>
          </td>
        </tr>
      );
  };
  
  export default AdminTable;