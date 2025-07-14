'use client'


import useRentModal from '@/app/hooks/useRentModal'
import React, { useMemo, useState } from 'react'
import Modal from './Modal';
import Heading from '../Misc/Heading';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Counter from '../Inputs/Counter';
import CategoryInput from '../Inputs/CategoryInput';
import Input from '../Inputs/Input';
import ImageUpload from '../Inputs/ImageUpload';
import toast from 'react-hot-toast';
import createBoat from '@/app/actions/createBoat';

//This component is used to create listings.

enum STEPS {
    CATEGORY = 0,
    INFO = 1,
    DESCRIPTION = 2,
    MAXGUESTCOUNT = 3,
    MINGUESTCOUNT = 4,
    MAINIMAGE = 5,
    SUBIMAGE = 6,
    SUBIMAGETWO = 7,
    SUBIMAGETHREE = 8,
    PRICE = 9,
    ADULT_ADD_PRICE = 10,
    CHILD_ADD_PRICE = 11,
    DAY_ADULT_ADD_PRICE = 12,
    DAY_CHILD_ADD_PRICE = 13,
    PHONE = 14
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
    const { register, handleSubmit, setValue, watch, formState: { errors, }, reset } = useForm<FieldValues>(
        {
            defaultValues: {
                category: '', guestCount: 1, roomCount: 1, bathroomCount: 1,
                images: [], price: 6000, dayCruisePrice: 4500, adultAddonPrice: 500,
                dayAdultAddOnPrice: 500, childAddonPrice: 300, dayChildAddOnPrice: 500,
                title: '', guestTitle: '', maxDayGuest: 0, maxNightGuest: 0, minDayGuest: 0, minNightGuest: 0,
                phoneNumber: 0,
            }
        });


    const category = watch('category');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const image = watch('images');
    const maxDayGuest = watch('maxDayGuest');
    const maxNightGuest = watch('maxNightGuest');
    const childAddonPrice = watch('childAddonPrice');
    const adultAddonPrice = watch('adultAddonPrice');
    const guestTitle = watch('subTitle');
    const phoneNumber = watch('phoneNumber');

    const setCustomValue = (id: string, value: any) => {
        if (id === 'images') {
            setValue('images', [...image, value], {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,

            });
        } else {
            setValue(id, value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            });
        }
    };


    const onBack = () => {
        setStep((value) => value - 1)
    };

    const onNext = () => {
        setStep((value) => value + 1)
    };

    const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
        if (step !== STEPS.CHILD_ADD_PRICE) {
            return onNext();
        }
        setIsLoading(true);
        //Need to add a empty checking for details here !!
        try {
            // Parse numeric values
            const parsedData = {
                ...data,
                price: parseFloat(data.price),
                dayCruisePrice: parseFloat(data.dayCruisePrice),
                maxDayGuest: parseInt(data.maxDayGuest),
                maxNightGuest: parseInt(data.maxNightGuest),
                minDayGuest: parseInt(data.minDayGuest),
                minNightGuest: parseInt(data.minNightGuest),
                reservations: [],
                phoneNumber: parseInt(data.phoneNumber)
            };

            createBoat(parsedData)
                .then(() => {
                    setIsLoading(false);
                    rentModal.onClose();
                    toast.success("Boat successfully added");
                });

        } catch (error) {
            console.error(error);
            toast.error("Failed to add boat!");
            setIsLoading(false);
        }
    };


    const actionLabel = useMemo(() => {
        if (step === STEPS.CHILD_ADD_PRICE) {
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
                <Input id="guestTitle" label="Guest's Title" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.MAXGUESTCOUNT) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Max number of Guests you'd allow?" subtitle="Gives clarity to the guest!." />
                <Input id="maxDayGuest" label="MaxDayGuestCount" disabled={isLoading} register={register} errors={errors} required />
                <hr />
                <Input id="maxNightGuest" label="MaxNightGuestCount" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }


    if (step === STEPS.MINGUESTCOUNT) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Min number of Guests you need?" subtitle="Gives clarity to the guest!." />
                <Input id="minDayGuest" label="minDayGuestCount" disabled={isLoading} register={register} errors={errors} required />
                <hr />
                <Input id="minNightGuest" label="minNightGuestCount" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.MAINIMAGE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add an outer photo of your place" subtitle="Show guests what your place looks like!" />
                <ImageUpload
                    onChange={(value) => setCustomValue('images', value)}
                    value={image}
                />
            </div>

        )
    }

    if (step === STEPS.SUBIMAGE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a sub image of your place" subtitle="Show guests what your place looks like!" />
                <ImageUpload
                    onChange={(value) => setCustomValue('images', value)}
                    value={image}
                />
            </div>

        )
    }
    if (step === STEPS.SUBIMAGETWO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a second sub image of your place" subtitle="Show guests what your place looks like!" />
                <ImageUpload
                    onChange={(value) => setCustomValue('images', value)}
                    value={image}
                />
            </div>

        )
    }
    if (step === STEPS.SUBIMAGETHREE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Add a third sub image of your place" subtitle="Show guests what your place looks like!" />
                <ImageUpload
                    onChange={(value) => setCustomValue('images', value)}
                    value={image}
                />
            </div>

        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, set your price" subtitle="How much do you charge per night?" />
                <Input id="price" label="OverNight Price" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
                <Input id="dayCruisePrice" label="DayCruise Price" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />

            </div>
        )
    }

    if (step === STEPS.ADULT_ADD_PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, Additional Price for Adult in OverNight" subtitle="How much do you charge per night?" />
                <Input id="adultAddonPrice" label=" Additional Price for Adults in OverNight" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.DAY_ADULT_ADD_PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, Additional Price for Adult in DayCruise" subtitle="How much do you charge per night?" />
                <Input id="dayAdultAddOnPrice" label=" Additional Price for Adults in DayCruise" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.CHILD_ADD_PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, Additional Price for Child in OverNight" subtitle="How much do you charge per night?" />
                <Input id="childAddonPrice" label=" Additional Price for Child in OverNight" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }

    if (step === STEPS.DAY_CHILD_ADD_PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading title="Now, Additional Price for Child in DayCruise" subtitle="How much do you charge per night?" />
                <Input id="dayChildAddOnPrice" label=" Additional Price for Children in DayCruise" formatPrice type="number" disabled={isLoading} register={register} errors={errors} required />
            </div>
        )
    }
    if (step === STEPS.PHONE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add your contact number"
                    subtitle="Your phone number will be visible to guests"
                />
                <Input
                    id="phoneNumber"
                    label="Phone Number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                    type="number"
                />
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