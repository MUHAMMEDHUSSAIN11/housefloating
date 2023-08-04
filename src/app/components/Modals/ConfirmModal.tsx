'use client'

import useBookingConfirmModal from '@/app/hooks/useBookingConfirmModal';
import React, { useState } from 'react'
import Heading from '../Misc/Heading';
import Input from '../Inputs/Input';
import Button from '../Misc/Button';
import Modal from './Modal';
import { FieldValues, useForm } from 'react-hook-form';




const ConfirmModal = () => {
    const BookingConfirmModal = useBookingConfirmModal();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, }, } = useForm<FieldValues>({ defaultValues: { Phonenumber : '' }, });

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Confirm your order!" subtitle="Verify your Contact number" />
          
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
        <hr />
        </div>
    )
    return (
     <Modal
        disabled={isLoading}
        isOpen={BookingConfirmModal.isOpen}
        title="Confirmation"
        actionLabel="Continue"
        onClose={BookingConfirmModal.onClose}
        onSubmit={() => {}}
        body={bodyContent}
        footer={footerContent} 
    />
    )
}

export default ConfirmModal
