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
import { auth } from '@/app/firebase/clientApp';
import { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import useTravelModeStore from '@/app/hooks/useTravelModeStore';
import { useRouter } from 'next/navigation'
import { BookingStatus } from '@/app/enums/enums';
import * as NProgress from 'nprogress';
import sendotp from '@/app/actions/getOTP';
import validateOTP from '@/app/actions/validateOTP';
import RequestBooking from '@/app/actions/RequestBooking';
import { toast } from 'react-hot-toast';
import SendRequestTelegram from '@/app/actions/SendRequestTelegram';



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
    const router = useRouter();

    const handlePush = () => {
        router.push('/cart');
        NProgress.start();
        NProgress.done();
    };

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


    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cleanedPhoneNumber = data.phonenumber.replace(/-/g, ''); // Remove hyphens
        //sending OTP
        if (step === STEPS.PHONENUMBER) {
            if (cleanedPhoneNumber.length < 8) {
                toast.error("Invalid phonenumber");
                return;
            }
            try {
                setIsLoading(true);
                sendotp(cleanedPhoneNumber)
                    .then(response => {
                        setIsLoading(false);
                        if (response && response.ok) {
                            toast.success("OTP on its way!");
                            onNext();
                        } else {
                            toast.error("Oops! We couldn't send the OTP..Please try again!");
                            return;
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
                setIsLoading(true);
                if (otp.length < 4) {
                    toast.error("OTP must be 4 digits");
                }
                const response = await validateOTP(cleanedPhoneNumber, otp);
                setIsLoading(false);
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
            setIsLoading(true);
            // Create a new reservation document
            const reservationData = {
                Contactnumber: data.phonenumber,
                BookingDate: finalBookingDate,
                HeadCount: finalHeadCount,
                Price: finalPrice as number,
                Email: user?.email,
                BoatId: listing.getboat.id,
                BoatName: listing.getboat.data()?.title,
                MinorCount: finalMinorCount,
                Mode: travelMode.travelMode,
                Payment: false,
                Category: listing.getboat.data()?.category,
                Status: BookingStatus.Requested,
                Image: listing.getboat.data()?.images[0],
                CreatedOn: Timestamp.fromDate(new Date())
            };

            await RequestBooking(reservationData)
                .then(() => {
                    setIsLoading(false);
                    // toast.success('Boat enquiry raised successfully.');
                    toast('Boat enquiry raised successfully! Confirmation will be received within 1 hour!.', {
                        icon: '👏',
                        duration: 6000,
                    });
                    BookingConfirmModal.onClose();
                    setStep(STEPS.PHONENUMBER);
                    handlePush();
                    SendRequestTelegram(finalBookingDate, finalHeadCount, finalMinorCount, finalPrice, data.phonenumber, travelMode.travelMode,
                        listing.getboat.data()?.title, listing.getboat.data()?.category,listing.getboat.data()?.roomCount);
                })
                .catch((error) => {
                    toast.error('something went wrong! Please contact our team');
                });
        }
    }

    let bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Confirm your order!" subtitle="Verify your Contact number" />
            <PhoneInput style={{ width: '100%' }}
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
                <OtpInput value={otp} inputStyle={{ border: "1px solid transparent", borderRadius: "8px", width: "54px", height: "54px", fontSize: "12px", color: "#000", fontWeight: "400", caretColor: "blue" }}
                    shouldAutoFocus={true}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />} />
            </div>
        )
    }

    if (step === STEPS.SUMMARY) {
        bodyContent = (
            <div className='flex flex-col gap-4 font-sans'>
                <Heading title='Your Order Summary' />
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold">{listing.getboat.data()?.title}</p>
                    <p className="text-gray-900">{listing.getboat.data()?.roomCount} Bedroom, {listing.getboat.data()?.category}</p>
                    <p className="text-gray-900">Booking Date: {finalBookingDate.toDateString()}</p>
                    <p className="text-gray-900">Total Price: {finalPrice}</p>
                    <p className="text-gray-900">Guest Count: {finalHeadCount + finalMinorCount}</p>
                </div>
                <p className="text-gray-900"> We aim to provide updates within 1 hour. Thank you for your patience!</p>
                <p className="text-gray-900">Please note that some boats may be unavailable due to Offline or Spot Bookings.</p>
                <p className="text-gray-900">Look out for a confirmation message on your WhatsApp or Email!</p>
                <p className="text-gray-900">If the chosen boat is unavailable, we'll quickly provide a list of alternative options for you to consider.</p>
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
            disabled={isLoading}
            onClose={BookingConfirmModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default ConfirmModal
