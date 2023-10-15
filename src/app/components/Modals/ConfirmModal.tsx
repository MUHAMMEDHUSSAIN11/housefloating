'use client'

import useBookingConfirmModal from '@/app/hooks/useBookingConfirmModal';
import React, { useMemo, useState } from 'react'
import Heading from '../Misc/Heading';
import Modal from './Modal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import OtpInput from 'react-otp-input';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/app/firebase/clientApp';
import { DocumentData, DocumentSnapshot, Timestamp, addDoc, collection, doc, runTransaction } from 'firebase/firestore';
import toast from 'react-hot-toast';
import sendotp from '@/app/actions/getOTP';
import validateOTP from '@/app/actions/validateOTP';
import useTravelModeStore from '@/app/hooks/useTravelModeStore';



enum STEPS {
    PHONENUMBER = 0,
    OTP = 1,
    SUMMARY = 2,
}

interface confirmModalProps {
    listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> },
    finalPrice: number,
    finalHeadCount: number,
    finalBookingDate: Date,
    finalMinorCount: number,
    modeOfTravel: string,
}


const ConfirmModal: React.FC<confirmModalProps> = ({ listing, finalPrice, finalHeadCount, finalBookingDate, finalMinorCount }) => {

    const BookingConfirmModal = useBookingConfirmModal();

    const [step, setStep] = useState(STEPS.PHONENUMBER);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');

    const [user] = useAuthState(auth);
    const travelMode = useTravelModeStore();

    //need to redesign this as inputs are custom react npm's..
    const { register, handleSubmit, setValue, watch, formState: { errors, }, } = useForm<FieldValues>();

    const phonenumber = watch('phonenumber');
    // const otp = watch('otp');


    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1)
    };

    const onNext = () => {
        setStep((value) => value + 1)
    };

    const actionLabel = useMemo(() => {
        if (step === STEPS.PHONENUMBER) {
            return 'Get OTP';
        } else if (step === STEPS.OTP) {
            return 'verify OTP';
        }
        return 'Confirm';
    }, [step]);

    // const secondaryActionLabel = useMemo(()=> {
    //     if(step === STEPS.PHONENUMBER || step === STEPS.OTP){
    //         return undefined;
    //     }
    //     return 'Back';
    // },[step])

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cleanedPhoneNumber = data.phonenumber.replace(/-/g, ''); // Remove hyphens
        //sending OTP
        if (step === STEPS.PHONENUMBER) {
            if (cleanedPhoneNumber.length < 8) {
                toast.error("Invalid phonenumber");
                return;
            }
            try {
                sendotp(cleanedPhoneNumber)
                    .then(response => {
                        if (response && response.ok) {
                            toast.success("OTP on its way!");
                            onNext();
                        } else {
                            toast.error("Oops! We couldn't send the OTP...");
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        toast.error("something went wrong!");
                    });
            } catch (error) {
                console.error('Error:', error);
                toast.error("something went wrong!");
                return;
            }
        }

        // Validating the OTP
        if (step === STEPS.OTP) {
            try {
                if (otp.length < 4) {
                    throw new Error("OTP must be 4 digits");
                }
                const response = await validateOTP(cleanedPhoneNumber, otp);
                if (response && response.ok) {
                    const responseData = await response.json();
                    if (responseData.verification_Check_status === "approved") {
                        toast.success("OTP verified successfully");
                        onNext();
                    } else {
                        toast.error('OTP verification failed');
                    }
                } else {
                    // API call failed
                    toast.error('Error verifying OTP');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error verifying OTP');
            }
        }

        //Raising the request for booking
        if (step === STEPS.SUMMARY) {
            const reservationsCollection = collection(firestore, 'Reservations');
            // Create a new reservation document
            const reservationData = {
                Contactnumber: data.phonenumber,
                BookingDate: finalBookingDate,
                HeadCount: finalHeadCount,
                Price: finalPrice,
                Email: user?.email,
                BoatId: listing.getboat.id,
                BoatName: listing.getboat.data()?.title,
                MinorCount: finalMinorCount,
                Mode: travelMode.travelMode,
            };

            runTransaction(firestore, async (transaction) => {
                const boatDocRef = doc(firestore, 'Boats', listing.getboat.id);

                // Get the current reservations array
                const boatDoc = await transaction.get(boatDocRef);
                const currentReservations = boatDoc.data()?.reservations || [];

                // Convert finalBookingDate to Firestore Timestamp
                const finalBookingTimestamp = new Timestamp(
                    Math.floor(finalBookingDate.getTime() / 1000), // Convert milliseconds to seconds
                    0 // Nanoseconds
                );
                // Add the new bookingDate (as Timestamp) to the reservations array
                currentReservations.push(finalBookingTimestamp);

                try {
                    // Update the "Reservations" array in the "Boats" collection
                    transaction.update(boatDocRef, { reservations: currentReservations });

                    // Add the reservation to the "Reservations" collection
                    const docRef = await addDoc(reservationsCollection, reservationData);
                    return docRef;
                } catch (error) {
                    throw error; // Rethrow the error for proper handling in the .catch block
                }
            })
                .then((docRef) => {
                    toast.success('Boat enquiry raised successfully.');
                    BookingConfirmModal.onClose();
                    setStep(STEPS.PHONENUMBER);
                })
                .catch((error) => {
                    toast.error('Something went wrong in reservation');
                });
        }
    }

    let bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Confirm your order!" subtitle="Verify your Contact number" />
            <PhoneInput
                defaultCountry="in"
                value={phonenumber}
                onChange={(value) => setCustomValue('phonenumber', value)}
            />
        </div>
    )

    if (step === STEPS.OTP) {
        bodyContent = (
            <div className='flex flex-col gap-4'>
                <Heading title="verify your phonenumber" />
                <OtpInput value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />} />
            </div>
        )
    }

    if (step === STEPS.SUMMARY) {
        bodyContent = (
            <div className='flex flex-col gap-4'>
                <Heading title='your order summary' />
                <p className='font-semibold font-sans'>You have selected {listing.getboat.data()?.title},
                    {listing.getboat.data()?.roomCount} Bedroom,{listing.getboat.data()?.category}
                    <br /> on {finalBookingDate.toDateString()}
                    <br /> for {finalPrice}
                </p>
                <p>Guest Count : {finalHeadCount + finalMinorCount}</p>
            </div>
        )
    }

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
        </div>
    )

    return (
        <Modal
            isOpen={BookingConfirmModal.isOpen}
            title="Confirmation"
            actionLabel={actionLabel}
            onClose={BookingConfirmModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default ConfirmModal
