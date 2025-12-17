'use client';

import React from 'react';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from './ListingClient';

import useSWR from 'swr';

import getBoatbyId from '@/app/actions/getBoatbyId';
import ListingSkeleton from './ListingSkeleton';
// import GetBoatById from '@/app/actions/GetBoatById/GetBoatById';

interface Iparams {
  listingid?: string;
  // Date: Date;
  // CruiseTypeId: number;
}

const fetchBoatData = async (listingId: string ) => {
  const fetchedBoatData = await getBoatbyId({ listingid: listingId });
  return fetchedBoatData;
};

// const fetchBoatData = async (listingId: string,Date: Date,CruiseTypeId: number ) => {
//   const fetchedBoatData = await GetBoatById({
//       BoatId: parseInt(listingId),
//       Date: Date,
//       CruiseTypeId: CruiseTypeId,
//     });
//   return fetchedBoatData;
// };

//maybe useParams can be implemented here.

const Listingpage = ({ params }: { params: Iparams }) => {
  const listingId:any = params.listingid;
  // const Date:Date = params.Date;
  // const CruiseTypeId:number = params.CruiseTypeId;
  // const { data: fetchedBoatData,error,isLoading } = useSWR(listingId, () => fetchBoatData(listingId,Date,CruiseTypeId));
  const { data: fetchedBoatData,error,isLoading } = useSWR(listingId, () => fetchBoatData(listingId));

  return (
    isLoading ? (
      <div className='pt-40 md:pt-24 text-lg'>
        <ListingSkeleton/>
      </div>
    ) : (
      !fetchedBoatData || error ? (
        <EmptyState showReset />
      ) : (
        <ListingClient listing={fetchedBoatData} />
      )
    )
  );

};

export default Listingpage;
