// import toast from "react-hot-toast";
// import { firestore } from "../firebase/clientApp";
// import { query, collection, where, getDocs, doc, updateDoc } from "firebase/firestore";
// import { BookingStatus } from "../enums/enums";

// //there is another similar function implemented..may be will remove it

// export default async function UpdateStatusToConfirmed(boatId: string, bookingDate: Date) {
//   try {
//     // Query the Reservations collection to find the document with matching BoatId and BookingDate
//     const reservationsRef = collection(firestore, "Reservations");
//     const q = query(reservationsRef, where("BoatId", "==", boatId), where("BookingDate", "==", bookingDate));
//     const querySnapshot = await getDocs(q);

//     // If a matching document is found, update its Status to "Confirmed" and Payment to "True"!!
//     if (!querySnapshot.empty) {
//       const reservationDoc = querySnapshot.docs[0];
//       const reservationId = reservationDoc.id;

//       await updateDoc(doc(reservationsRef, reservationId), {
//         Status: BookingStatus.Confirmed,
//         Payment: true,
//       });
      
//       toast.success("Booking Status Updated to Confirmed.");
//     } else {
//       toast.error("No matching document found.");
//     }
//   } catch (error) {
//     toast.error("Failed to update status to Paid.");
//   }
// }
