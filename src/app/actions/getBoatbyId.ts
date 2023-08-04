import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";


interface Iparams{
    listingid?: string;
}

export default async function getBoatbyId( params: Iparams) {
    try{
        const{listingid} = params;
        const boatRef = doc(collection(firestore,'Boats'),listingid)
        const getBoat = await getDoc(boatRef);
        return getBoat;
    }catch(error:any){
        throw new error(error);
    }
 
}