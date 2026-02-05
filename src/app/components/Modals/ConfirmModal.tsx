'use client'

import useBookingConfirmModal from '@/app/hooks/useBookingConfirmModal';
import React, { useMemo, useState } from 'react'
import Heading from '../Misc/Heading';
import Modal from './Modal';
import { FieldValues, SubmitHandler, useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
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
import { amount, BoatBookingTypes } from '@/app/enums/enums';
import { BoatCruises, BoatCruisesId, BookingType } from '@/app/enums/enums';
import MakeRazorpay from '@/app/actions/MakeRazorpay';
import HandleCreateOnlineBooking from '@/app/actions/OnlineBookings/HandleCreateOnlineBooking';
import HandleDeleteOnlineBooking from '@/app/actions/OnlineBookings/HandleDeleteOnlineBooking';
import FormatToLocalDate from '../Misc/FormatToLocalDate';
import FormatToLocalDateTime from '../Misc/FormatToLocalDateTime';
import Input from '../Inputs/Input';
import countries from 'world-countries';
import { State } from 'country-state-city'
import jsCookie from 'js-cookie';

enum STEPS {
    PHONENUMBER = 0,
    OTP = 1,
    GUESTDETAILS = 2,
    SUMMARY = 3,
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

    const { register, handleSubmit, setValue, watch, control, formState: { errors, }, } = useForm<FieldValues>({
        defaultValues: {
            guestCountry: 'India',
            guestState: '',
            guestName: '',
            phonenumber: ''
        }
    });

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
        } else if (step === STEPS.GUESTDETAILS) {
            return 'Confirm Details'
        }
        return `Proceed To Pay Advance`;
    }, [step, finalPrice]);


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

        if (step === STEPS.GUESTDETAILS) {
            if (data.guestName.trim() === "") {
                toast.error("Guest name is required");
                return;
            }
            if (data.guestCountry === 'India' && !data.guestState) {
                toast.error("Please select a state");
                return;
            }
            onNext();
        }

        if (step === STEPS.SUMMARY) {
            setIsLoading(true)

            try {
                const isSharing = bookingTypeId === BookingType.sharing;
                const finalRoomCount = isSharing ? roomCount : undefined;
                const tripDateLocal = FormatToLocalDate(finalCheckInDate);
                const localBookingDate = FormatToLocalDateTime(new Date());

                const guestName = data.guestName;
                const country = data.guestCountry;
                const state = data.guestState;
                const guestPlace = state ? `${state}, ${country}` : country;

                const bookingData = {
                    adultCount: finalHeadCount,
                    boatId: boatDetails.boatId,
                    bookingDate: localBookingDate,
                    childCount: finalMinorCount,
                    contactNumber: cleanedPhoneNumber,
                    cruiseTypeId: modeOfTravel === BoatCruises.dayCruise ? BoatCruisesId.dayCruise : modeOfTravel === BoatCruises.dayNight ? BoatCruisesId.dayNight : BoatCruisesId.nightStay,
                    guestName: guestName,
                    guestPlace: guestPlace,
                    guestUserId: user?.id || 0,
                    isVeg: isVeg,
                    price: finalPrice,
                    tripDate: tripDateLocal,
                    boardingPoint: boatDetails.boardingPoint,
                    isSharing: isSharing,
                    roomCount: finalRoomCount
                };

                let bookingResponse;
                try {
                    bookingResponse = await HandleCreateOnlineBooking(bookingData);
                } catch (err) {
                    toast.error('Failed to create booking');
                    setIsLoading(false);
                    return;
                }

                if (bookingResponse && bookingResponse.data && bookingResponse.data.bookingId) {
                    const bookingId = bookingResponse.data.bookingId;
                    const bookingType = bookingResponse.data.bookingType === BoatBookingTypes.onlineBooked ? 'Private' : 'Sharing';
                    const boatName = bookingResponse.data.boatName;
                    const adultCount = bookingResponse.data.adultCount;
                    const childCount = bookingResponse.data.childCount;

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
                            metadata: {
                                onlineBookingId: bookingId,
                                at: jsCookie.get('token'), // Include token for webhook authentication
                                ...(() => {
                                    const emailInfo = {
                                        bc: boatDetails.boatCode,
                                        bn: boatName,
                                        bCat: boatDetails.boatCategory,
                                        brc: boatDetails.bedroomCount,
                                        bi: boatDetails.boatImages?.[0],
                                        bt: bookingType,
                                        bd: localBookingDate,
                                        bid: bookingId,
                                        ac: adultCount,
                                        cc: childCount,
                                        ct: modeOfTravel,
                                        td: tripDateLocal,
                                        gn: guestName,
                                        gp: guestPlace,
                                        gph: cleanedPhoneNumber,
                                        ge: user?.email,
                                        oe: boatDetails.ownerEmail,
                                        tp: finalPrice,
                                        aa: Math.round(finalPrice * amount.advance),
                                        ra: Math.round(finalPrice * amount.remaining),
                                    };
                                    const str = JSON.stringify(emailInfo);
                                    return {
                                        ed1: str.substring(0, 250),
                                        ed2: str.substring(250, 500),
                                        ed3: str.substring(500, 750),
                                    };
                                })()
                            },
                            onSuccess: () => {
                                setIsLoading(false);
                                BookingConfirmModal.onClose();
                                setStep(STEPS.PHONENUMBER);
                                handlePush();
                            },
                            onError: (err: any) => {
                                setIsLoading(false);
                                console.error('Payment Error/Cancelled:', err);

                                // Silently delete the booking
                                const deletionData = {
                                    bookingId: bookingId,
                                };
                                HandleDeleteOnlineBooking(deletionData).catch(deleteErr => {
                                    console.error('Failed to delete booking after payment failure:', deleteErr);
                                });
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
                <OtpInput value={otp} inputStyle={{ border: "1px solid #d1d5db", borderRadius: "8px", width: "54px", height: "54px", fontSize: "16px", color: "#000", fontWeight: "400", caretColor: "blue" }}
                    shouldAutoFocus={true}
                    onChange={setOtp}
                    numInputs={4}
                    inputType='number'
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />} />
            </div>
        )
    }

    if (step === STEPS.GUESTDETAILS) {
        const selectedCountry = watch('guestCountry');

        const countryOptions = countries
            .map((country) => ({
                value: country.name.common,
                label: country.name.common,
                flag: country.flag,
                code: country.cca2.toLowerCase()
            }))
            .sort((a, b) => a.value.localeCompare(b.value));

        const selectedCountryCode = countries.find(c => c.name.common === selectedCountry)?.cca2 || 'IN';
        const dynamicStates = State.getStatesOfCountry(selectedCountryCode);

        const stateOptions = dynamicStates
            .map((state) => ({
                value: state.name,
                label: state.name
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        bodyContent = (
            <div className="flex flex-col gap-4">
                <Heading title="Confirm your details" subtitle="Please provide your name and location" />

                <Input
                    id="guestName"
                    label="Guest Name"
                    register={register}
                    errors={errors}
                    required
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-neutral-500 ml-1">Country</label>
                    <Controller
                        name="guestCountry"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={countryOptions}
                                value={countryOptions.find(c => c.value === field.value) || null}
                                onChange={(val: any) => {
                                    field.onChange(val?.value || '');
                                    // Reset state when country changes from India
                                    if (val?.value !== 'India') {
                                        setValue('guestState', '');
                                    }
                                }}
                                placeholder="Select Country"
                                formatOptionLabel={(option: any) => (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://flagcdn.com/w20/${option.code}.png`}
                                            alt={option.value}
                                            width="20"
                                            className="rounded-sm"
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        padding: '5px',
                                        borderRadius: '0.375rem',
                                        borderWidth: '2px',
                                        borderColor: '#d4d4d8',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#000'
                                        }
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999
                                    })
                                }}
                            />
                        )}
                    />
                </div>

                {selectedCountry === 'India' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-neutral-500 ml-1">State / Province</label>
                        <Controller
                            name="guestState"
                            control={control}
                            rules={{ required: selectedCountry === 'India' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={stateOptions}
                                    value={stateOptions.find(s => s.value === field.value) || null}
                                    onChange={(val: any) => field.onChange(val?.value || '')}
                                    placeholder="Select State / Province"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '5px',
                                            borderRadius: '0.375rem',
                                            borderWidth: '2px',
                                            borderColor: '#d4d4d8',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: '#000'
                                            }
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999
                                        })
                                    }}
                                />
                            )}
                        />
                    </div>
                )}
            </div>
        )
    }

    if (step === STEPS.SUMMARY) {
        const isSharing = bookingTypeId === BookingType.sharing;
        const guestName = watch('guestName');
        const country = watch('guestCountry');
        const state = watch('guestState');
        const guestPlace = state ? `${state}, ${country}` : country;

        bodyContent = (
            <div className='flex flex-col gap-4 font-sans text-[15px]'>
                <Heading title='Your Order Summary' />
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-1">
                    <p className="text-lg font-semibold">{boatDetails.boatCode}</p>
                    {isSharing
                        ? <p className="text-gray-900">Sharing, {boatDetails.boatCategory}</p>
                        : <p className="text-gray-900">{boatDetails.bedroomCount} Bedroom, {boatDetails.boatCategory}</p>}
                    <hr className="my-1 border-gray-100" />
                    <p className="text-gray-900 font-medium">Guest: <span className="font-normal">{guestName}</span></p>
                    <p className="text-gray-900 font-medium">Location: <span className="font-normal">{guestPlace}</span></p>
                    <p className="text-gray-900">Trip Date: {new Date(finalCheckInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</p>
                    <p className="text-gray-900">Guest Count: {finalHeadCount + finalMinorCount}</p>
                    {isSharing && <p className="text-gray-900">Room Count: {roomCount}</p>}
                    <hr className="my-1 border-gray-100" />
                    <p className="text-gray-900">Total Price: ₹{finalPrice}</p>
                    <p className="text-gray-900 flex">Advance Amount:<span className='ml-1 font-semibold text-black'>₹{Math.round(finalPrice * amount.advance)}</span></p>
                    <p className="text-md font-light text-red-500">Balance Amount Pay at Boat</p>
                    <p className="text-gray-900">Balance Amount: ₹{Math.round(finalPrice * amount.remaining)}</p>
                </div>
            </div>
        )
    }

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr className='border border-gray-300' />
        </div>
    )

    return (
        <Modal
            isOpen={BookingConfirmModal.isOpen}
            title={step === STEPS.SUMMARY ? "Review Booking" : "Confirm your order"}
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