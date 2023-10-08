import { Timestamp, collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../app/firebase/clientApp";



interface Iparams{
    listingid?: string;
}
//converted date[] cannot be embedded into firestore doc because it saves as seconds,nanosec..so returning it as seperates...
export default async function getBoatbyId( params: Iparams) {
    //need to make this call directly in client using 'useSWR' 
    //or store in cookies from home page as found in github..
    try{
        const{listingid} = params;
        const boatRef = doc(collection(firestore,'Boats'),listingid);
        const getboat = await getDoc(boatRef);
        const TimestampDates:Timestamp[]= getboat.data()?.reservations
        const reservedDates:Date[] = TimestampDates.map((reservation:Timestamp) => reservation.toDate());
        const boat = { reservedDates,getboat};
        return boat;
    }catch(error:any){
        throw new error(error);
    }
 
}