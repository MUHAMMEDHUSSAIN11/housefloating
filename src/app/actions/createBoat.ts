// import { addDoc, collection, DocumentReference } from "firebase/firestore";
// import { firestore } from "../firebase/clientApp";

// export default async function createBoat(boatDetails: ParsedData): Promise<DocumentReference> {
//   // Return the DocumentReference for the created boat
//   return await addDoc(collection(firestore, "Boats"), boatDetails);
// }

import { collection, doc, runTransaction } from 'firebase/firestore';
import { firestore } from "../firebase/clientApp";


interface ParsedData extends Record<string, any> {
  price: number;
  maxDayGuest: number;
  maxNightGuest: number;
  reservations: any[];
  dayCruisePrice: number;
}


const generateBoatId = (counter:number, prefix = 'HF', padding = 4) =>
  prefix + counter.toString().padStart(padding, '0');

export default async function createBoat(boatDetails: ParsedData) {
  const newBoatRef = doc(collection(firestore, 'Boats'));

  await runTransaction(firestore, async (transaction) => {
    const counterRef = doc(firestore, 'counters', 'boats');
    const counterSnap = await transaction.get(counterRef);

    let nextId = 1;

    if (counterSnap.exists()) {
      nextId = counterSnap.data().count + 1;
      transaction.update(counterRef, { count: nextId });
    } else {
      transaction.set(counterRef, { count: 1 });
    }

    const formattedId = generateBoatId(nextId);
    transaction.set(newBoatRef, { ...boatDetails, boatId: formattedId });
  });

  return newBoatRef;
}
