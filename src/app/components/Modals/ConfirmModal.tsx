'use client'

import useBookingConfirmModal from '@/app/hooks/useBookingConfirmModal';
import React, { useMemo, useState } from 'react'
import Heading from '../Misc/Heading';
import Modal from './Modal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import OtpInput from 'react-otp-input';
import useBookingDateStore from '@/app/hooks/useBookingDate';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/clientApp';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';



enum STEPS {
    PHONENUMBER =0,
    OTP =1,
    SUMMARY=2,
}

interface confirmModalProps {
    listing: { reservedDates: Date[], getboat: DocumentSnapshot<DocumentData> }
  }



const ConfirmModal:React.FC<confirmModalProps> = ({listing}) => {

    const BookingConfirmModal = useBookingConfirmModal();

    const [step, setStep] = useState(STEPS.PHONENUMBER)
    const [isLoading, setIsLoading] = useState(false);
    const [otp,setOtp] = useState('');
    const requestedDate = useBookingDateStore();
    const [user] = useAuthState(auth)


    const { register, handleSubmit,setValue, watch,formState: { errors, }, } = useForm<FieldValues>();

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
        }else if ( step === STEPS.OTP){
            return 'verify OTP';
        }
        return 'Confirm';
    }, [step]);

    const secondaryActionLabel = useMemo(()=> {
        if(step === STEPS.PHONENUMBER || step === STEPS.OTP){
            return undefined;
        }
        return 'Back';
    },[step])

    const onSubmit:SubmitHandler<FieldValues> = async (data) => {

        if (step === STEPS.PHONENUMBER) {
            try {
              // Make API call using fetch to your custom API route
              const response = await fetch('/api/twilio/sendOTP', {
                method: 'POST',
              });
        
              if (response.ok) {
                // API call succeeded, progress to the next step
                onNext();
              } else {
                // API call failed
                console.error('Error sending OTP');
              }
            } catch (error) {
              // Handle any errors that occurred during the API call
              console.error('API error:', error);
            }
            
            return;
          }
        
        if(step===STEPS.OTP){
            return onNext();
        }
        if(step === STEPS.SUMMARY){
            console.log(data,requestedDate.bookingDate,user?.email,listing.getboat.id);
        }

    }

   let bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Confirm your order!" subtitle="Verify your Contact number" />
            <PhoneInput
                defaultCountry="in"
                value={phonenumber}
                onChange={(value) => setCustomValue('phonenumber',value)}
            />
        </div>
    )

    if(step === STEPS.OTP){
         bodyContent = (
            <div className='flex flex-col gap-4'>
                <Heading title="verify your phonenumber" />
                <OtpInput value={otp} 
                onChange={setOtp} 
                numInputs={4} 
                renderSeparator={<span>-</span>}
                renderInput={(props) => <input {...props} />}/>
            </div>
        )
    }

    if(step === STEPS.SUMMARY){
        bodyContent =(
            <div className='flex flex-col gap-4'>
                <Heading title='your order summary' />
                <h2>you have selected {requestedDate.bookingDate.toDateString()}</h2>
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
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.PHONENUMBER ? undefined : onBack}
            onClose={BookingConfirmModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default ConfirmModal
