'use client';

import { DocumentData } from 'firebase/firestore';
import React from 'react'
import { BookingStatus } from '../enums/enums';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';


interface DataProps {
  reservation: DocumentData,
  reservationID: string,
  onAction: (reservation: DocumentData) => void;
}

const AdminTable: React.FC<DataProps> = ({ reservation,onAction }) => {



  function formatDate(date: any) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toDate().toLocaleDateString(options);
  }


  return (
    <>
      <tr className="border-b">
        <td className="px-4 py-2 text-black">{reservation.BoatName}</td>
        <td className="px-4 py-2 text-black">{reservation.Category}</td>
        <td className="px-4 py-2 text-black">{reservation.Contactnumber}</td>
        <td className="px-4 py-2 text-black">{reservation.HeadCount}</td>
        <td className="px-4 py-2 text-black">{reservation.MinorCount}</td>
        <td className="px-4 py-2 text-black">{reservation.Price}</td>
        <td className="px-4 py-2 text-black">{reservation.Status}</td>
        <td className="px-4 py-2 text-black">{formatDate(reservation.BookingDate)}</td>
        {reservation.Status == BookingStatus.Requested &&
          <td className="px-4 py-2">
            <a href="#" onClick={() => onAction(reservation)} className="text-blue-600 hover:underline">
              Update
            </a>
          </td>
        }
      </tr>
    </>
  );
};

export default AdminTable;