import { addDoc, collection, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";

interface ParsedData extends Record<string, any> {
    price: number;
    maxDayGuest: number;
    maxNightGuest: number;
    reservations: any[]; 
  }
  

  export default async function createBoat(boatDetails: ParsedData): Promise<DocumentReference> {
    // Return the DocumentReference for the created boat
    return await addDoc(collection(firestore, "Boats"), boatDetails);
  }