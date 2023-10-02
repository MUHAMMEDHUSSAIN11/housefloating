'use client';


import React, { useEffect, useState } from 'react';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/Misc/EmptyState';
import ListingClient from '../ListingClient';
import getBoatbyId from '@/app/actions/getBoatbyId'; 
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';


interface Iparams {
  listingid?: string;
}

interface IBoatData {
  reservedDates: Date[];
  getboat: DocumentSnapshot<DocumentData>;
}


const Listingpage = ({ params }: { params: Iparams }) => {
  const [boatData, setBoatData] = useState<IBoatData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoatData = async () => {
      try {
        if (params.listingid) {
          const fetchedBoatData = await getBoatbyId(params);
          setBoatData(fetchedBoatData);
        }
      } catch (error) {
        console.error('Error fetching boat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoatData();
  }, [params]);

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!boatData) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient listing={boatData} />
    </ClientOnly>
  );
};

export default Listingpage;
