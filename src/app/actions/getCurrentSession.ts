import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { app, auth, firestore } from "../firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth';
import React from "react";




export default async function getCurrentSession() {
  try {
    
  
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.email) {
    //   return null;
    // }

    // const userDocRef = doc(firestore, "Users", session.user.email);
    // const userDocSnap = await getDoc(userDocRef);

    // if (!userDocSnap.exists()) {
    //   return null;
    // }

  } catch (error: any) {
    console.log(error);
    return null;
  }
}