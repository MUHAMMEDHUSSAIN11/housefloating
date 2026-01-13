'use client'

import useBookingConfirmModal from '@/app/hooks/useBookingConfirmModal';
import React, { useMemo, useState } from 'react'
import Heading from '../Misc/Heading';
import Modal from './Modal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import OtpInput from 'react-otp-input';
import { useRouter } from 'next/navigation'
import * as NProgress from 'nprogress';
import sendotp from '@/app/actions/getOTP';
import validateOTP from '@/app/actions/validateOTP';
import { toast } from 'react-hot-toast';
import useAuth from '@/app/hooks/useAuth';
import { BoatDetails } from '@/app/listings/[listingid]/page';
import { BoatCruisesId, BookingType } from '@/app/enums/enums';
import MakeRazorpay from '@/app/actions/MakeRazorpay';
import HandleCreateOnlineBooking from '@/app/actions/OnlineBookings/HandleCreateOnlineBooking';

enum STEPS {
    PHONENUMBER = 0,
    OTP = 1,
    SUMMARY = 2,
}

interface confirmModalProps {
    boatDetails: BoatDetails,
    modeOfTravel: string,
    finalPrice: number,
    finalHeadCount: number,
    finalCheckInDate: Date,
    finalCheckOutDate: Date,
    finalMinorCount: number,
    isVeg: boolean,
    bookingTypeId: number | null,
    roomCount: number,
}


const ConfirmModal: React.FC<confirmModalProps> = ({ boatDetails, modeOfTravel, finalPrice, finalHeadCount, finalCheckInDate, finalCheckOutDate, finalMinorCount, isVeg, bookingTypeId, roomCount }) => {

    const BookingConfirmModal = useBookingConfirmModal();
    const [step, setStep] = useState(STEPS.PHONENUMBER);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    const handlePush = () => {
        router.push('/cart');
        NProgress.start();
        NProgress.done();
    };

    const { register, handleSubmit, setValue, watch, formState: { errors, }, } = useForm<FieldValues>();

    const phonenumber = watch('phonenumber');

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
        return 'Proceed to Payment';
    }, [step]);


    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const cleanedPhoneNumber = data.phonenumber.replace(/-/g, '');
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
                    toast.error('Error verifying OTP');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error verifying OTP');
            }
        }

        if (step === STEPS.SUMMARY) {
            setIsLoading(true)

            try {
                const isSharing = bookingTypeId === BookingType.sharing;
                const finalRoomCount = isSharing ? roomCount : undefined;

                const bookingData = {
                    adultCount: finalHeadCount,
                    boatId: boatDetails.boatId,
                    bookingDate: new Date().toISOString(),
                    childCount: finalMinorCount,
                    contactNumber: cleanedPhoneNumber,
                    cruiseTypeId: modeOfTravel === 'Day Cruise' ? BoatCruisesId.dayCruise : modeOfTravel === 'Overnight Cruise' ? BoatCruisesId.overNightCruise : BoatCruisesId.nightStay,
                    guestPlace: boatDetails.boardingPoint,
                    guestUserId: user?.id || 0,
                    isVeg: isVeg,
                    price: finalPrice,
                    tripDate: finalCheckInDate.toISOString(),
                    boardingPoint: boatDetails.boardingPoint,
                    isSharing: isSharing,
                    roomCount: finalRoomCount
                };

                let bookingResponse;
                try {
                    bookingResponse = await HandleCreateOnlineBooking(bookingData);
                } catch (err) {
                    console.error('Booking Creation Failed:', err);
                    toast.error('Failed to create booking');
                    setIsLoading(false);
                    return;
                }

                if (bookingResponse && bookingResponse.data && bookingResponse.data.bookingId) {
                    const bookingId = bookingResponse.data.bookingId;
                    const metadata = {
                        onlineBookingId: bookingId
                    };

                    console.log('Booking created:', bookingId, 'Initiating Payment...');

                    try {
                        await MakeRazorpay({
                            totalPrice: finalPrice,
                            description: `Booking for ${boatDetails.boatCode}`,
                            image: boatDetails.boatImages?.[0] || '/placeholder-boat.jpg',
                            prefill: {
                                name: user?.name || '',
                                email: user?.email || '',
                                contact: cleanedPhoneNumber,
                            },
                            metadata: metadata,
                            onSuccess: () => {
                                setIsLoading(false);
                                BookingConfirmModal.onClose();
                                setStep(STEPS.PHONENUMBER);
                                handlePush();
                            },
                            onError: (err: any) => {
                                setIsLoading(false);
                                console.error('Payment Error:', err);
                                toast.error('Payment failed or cancelled');
                            }
                        });
                    } catch (paymentErr) {
                        console.error('Payment Initialization Error:', paymentErr);
                        setIsLoading(false);
                        toast.error('Failed to initialize payment gateway');
                    }
                } else {
                    console.error('Invalid booking response:', bookingResponse);
                    toast.error('Failed to create booking - Please try again');
                    setIsLoading(false);
                }

            } catch (error) {
                console.error('Payment/Booking Error:', error);
                setIsLoading(false);
                toast.error('Something went wrong during payment initialization');
            }
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
                    <p className="text-lg font-semibold">{boatDetails.boatCode}</p>
                    <p className="text-gray-900">{boatDetails.bedroomCount} Bedroom, {boatDetails.boatCategory}</p>
                    <p className="text-gray-900">Booking Date: {new Date(finalCheckInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</p>
                    <p className="text-gray-900">Total Price: {finalPrice}</p>
                    <p className="text-gray-900">Guest Count: {finalHeadCount + finalMinorCount}</p>
                </div>
                <p className="text-gray-900 font-bold mt-2"> Thank you for your payment!</p>
                <p className="text-gray-900"> Your booking request is being processed. We’ll update you soon.</p>
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
