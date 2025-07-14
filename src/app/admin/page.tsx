'use client';

import { DocumentData } from 'firebase/firestore';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BookingStatus } from '../enums/enums';
import useSWR from 'swr';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-hot-toast';
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/tailwind-light/theme.css';
import { auth } from '../firebase/clientApp';
import getReservations from '../actions/getReservations';
import UpdateStatusToApprovedID from '../actions/UpdateStatusToApprovedID';
import isAuthority from '../actions/checkAuthority';
import EmptyState from '../components/Misc/EmptyState';
import Spinner from '../components/Misc/Spinner';
import ReservationRow from './ReservationRow';


const AdminPage = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const dtoast = useRef(null);

  const { data: reservations, error, isValidating, isLoading, mutate } = useSWR(
    'actions', 
    getReservations, 
    {
      refreshInterval: 10 * 60 * 1000,
    }
  );

  const onConfirm = useCallback((reservation: DocumentData) => {
    UpdatingConfirmation(reservation);
  }, []);

  const reject = () => {
    // Handle rejection logic here
  };

  const UpdatingConfirmation = async (reservation: DocumentData) => {
    if (reservation.Status === BookingStatus.Cancelled) {
      toast.error('Reservation is already Cancelled');
      return;
    }
    
    try {
      await UpdateStatusToApprovedID(reservation.id);
      toast.success('Reservation approved successfully!');
      mutate(); // Refresh the data
    } catch (error) {
      toast.error('Failed to approve reservation');
    }
  };

  const showConfirmationDialog = async (reservation: DocumentData) => {
    confirmDialog({
      message: 'Are you sure you want to approve this reservation?',
      header: 'Approve Reservation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onConfirm(reservation),
      reject,
      acceptClassName: 'p-3 rounded-md bg-green-600 text-white hover:bg-green-700',
      rejectClassName: 'p-3 rounded-md bg-gray-600 text-white hover:bg-gray-700',
    });
  };

  useEffect(() => {
    if (user?.uid) {
      setIsAdmin(isAuthority(user.uid));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Filter reservations based on search and status
  const filteredReservations = reservations?.docs?.filter((listing) => {
    const data = listing.data();
    const matchesSearch = !searchTerm || 
      data.BoatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.Contactnumber?.includes(searchTerm) ||
      data.BoatOwnerPhoneNumber?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || data.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusCounts = () => {
    if (!reservations?.docs) return { total: 0, requested: 0, approved: 0, cancelled: 0 };
    
    const counts = reservations.docs.reduce((acc, listing) => {
      const status = listing.data().Status;
      acc.total++;
      
      // Type-safe status counting
      const statusKey = status.toLowerCase() as keyof typeof acc;
      if (statusKey in acc && statusKey !== 'total') {
        acc[statusKey] = (acc[statusKey] || 0) + 1;
      }
      
      return acc;
    }, { total: 0, requested: 0, approved: 0, cancelled: 0 });
    
    return counts;
  };
  if (!user) {
    return <EmptyState title='Not logged in !!' subtitle='Please Log in as Administrator' />;
  }

  if (!isAdmin) {
    return <EmptyState title='Access Denied' subtitle='Play around other areas!' />;
  }

  if (isLoading || isValidating) {
    return (
      <div className="pt-28 flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !reservations) {
    return <EmptyState showReset />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="pt-36 md:pt-36 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all boat reservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requested</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.requested}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by boat name, contact number, or owner phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={BookingStatus.Requested}>Requested</option>
                <option value={BookingStatus.Approved}>Approved</option>
                <option value={BookingStatus.Cancelled}>Cancelled</option>
              </select>
            </div>
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Boat Details</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Owner Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Adults</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Children</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Booking Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((listing) => (
                    <ReservationRow
                      key={listing.id}
                      reservation={listing.data()}
                      reservationID={listing.id}
                      onAction={() => showConfirmationDialog(listing)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredReservations.length} of {reservations?.docs?.length || 0} reservations
        </div>
      </div>

      <Toast ref={dtoast} />
      <ConfirmDialog />
    </div>
  );
};

export default AdminPage;