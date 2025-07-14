'use client';

import { DocumentData } from "firebase-admin/firestore";
import { BookingStatus } from "../enums/enums";
import { Calendar, CheckCircle, Clock, Phone, Users, XCircle } from "lucide-react";
import CheckIsDateOver from "../actions/checkDateOver";


interface ReservationRowProps {
  reservation: DocumentData;
  reservationID: string;
  onAction: (reservation: DocumentData) => void;
}

const ReservationRow: React.FC<ReservationRowProps> = ({ reservation, reservationID, onAction }) => {
  const formatDate = (date: any) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toDate().toLocaleDateString('en-US', options);
  };

  const isDateNotOver = CheckIsDateOver(reservation.BookingDate.toDate());

  const getStatusBadge = (
    status: typeof BookingStatus.Requested | typeof BookingStatus.Approved | typeof BookingStatus.Cancelled
  ) => {
    const statusStyles: Record<typeof BookingStatus.Requested | typeof BookingStatus.Approved | typeof BookingStatus.Cancelled, string> = {
      [BookingStatus.Requested]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [BookingStatus.Approved]: 'bg-green-100 text-green-800 border-green-200',
      [BookingStatus.Cancelled]: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusIcons: Record<typeof BookingStatus.Requested | typeof BookingStatus.Approved | typeof BookingStatus.Cancelled, JSX.Element> = {
      [BookingStatus.Requested]: <Clock className="w-3 h-3" />,
      [BookingStatus.Approved]: <CheckCircle className="w-3 h-3" />,
      [BookingStatus.Cancelled]: <XCircle className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {statusIcons[status]}
        {status}
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{reservation.BoatName}</div>
        <div className="text-sm text-gray-500">{reservation.Category}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{reservation.Contactnumber}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{reservation.BoatOwnerPhoneNumber || 'N/A'}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{reservation.HeadCount}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{reservation.MinorCount}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-semibold text-gray-900">₹{reservation.Price}</span>
      </td>
      <td className="px-4 py-3">
        {getStatusBadge(reservation.Status)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{formatDate(reservation.BookingDate)}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {reservation.Status === BookingStatus.Requested && isDateNotOver && (
          <button
            onClick={() => onAction(reservation)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
        )}
      </td>
    </tr>
  );
};

export default ReservationRow;