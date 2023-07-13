'use client'
import useRentModal from '@/app/hooks/useRentModal'
import React, { useEffect, useMemo, useState } from 'react'
import Modal from './Modal';
import Heading from '../Misc/Heading';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Counter from '../Inputs/Counter';
import CategoryInput from '../Inputs/CategoryInput';
import Input from '../Inputs/Input';
import { firestore } from '@/app/firebase/clientApp';
import { addDoc } from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ImageUpload from '../Inputs/ImageUpload';

//This component is used to create listings.

enum STEPS {
    CATEGORY = 0,
    INFO = 1,
    DESCRIPTION = 2,
    IMAGES = 3,
    PRICE = 4,
}

const categories = [
    {
        label: 'Deluxe Houseboats',
    },
    {
        label: 'Premium Houseboats',
    },
    {
        label: 'Luxury Houseboats',
    }
]

const RentModal = () => {
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors, }, reset } = useForm<FieldValues>({ defaultValues: { category: '', guestCount: 1, roomCount: 1, bathroomCount: 1, imageSrc: '', price: 6000, title: '', description: '' } });


    const category = watch('category');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
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

    const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }
        setIsLoading(true);

        const createBoatDocument = async () => {
            try {
                await addDoc(collection(firestore, "Boats"), JSON.parse(JSON.stringify(data)));
                setIsLoading(false);
                rentModal.onClose();
                toast.success("Boat successfully added")
            } catch (error) {
                console.log(error);
                toast.error("something went wrong!")
                setIsLoading(false);
            }
        };
        createBoatDocument();
    };
  



    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }
        return 'Back'
    }, [step]);


    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading title="Which of these best describes your place?" subtitle="Pick a category" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput onClick={(category) =>
                            setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Share some basics about your place" subtitle="What amenitis do you have?" />
                <Counter onChange={(value) => setCustomValue('guestCount', value)} value={guestCount} title="Guests" subtitle="How many guests do you allow?" />
                <hr />
                <Counter onChange={(value) => setCustomValue('roomCount', value)} value={roomCount} title="Rooms" subtitle="How many rooms do you have?" />
                <hr />
                <Counter onChange={(value) => setCustomValue('bathroomCount', value)} value={bathroomCount} title="Bathrooms" subtitle="How many bathrooms do you have?" />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="How would you describe your place?" subtitle="Short and sweet works best!" />
                <Input id="title" label="Title" disabled={isLoading} register={register} errors={errors} required />
                <hr />
                <Input id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a photo of your place" subtitle="Show guests what your place looks like!" />
                <ImageUpload
                    onChange={(value) => setCustomValue('imageSrc', value)}
                    value={imageSrc}/>
            </div>

        )
    }


    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, set your price" subtitle="How much do you charge per night?" />
                <Input id="price" label="Price" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    return (
        <Modal
            isOpen={rentModal.isOpen}
            title="Add new Boat"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
        />
    )
}

export default RentModal