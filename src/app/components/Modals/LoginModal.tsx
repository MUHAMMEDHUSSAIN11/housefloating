'use client';

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import Modal from "./Modal";
import Input from "../Inputs/Input";
import Heading from "../Misc/Heading";
import Button from "../Misc/Button";
import toast from "react-hot-toast";
import useAuth from "@/app/hooks/useAuth";
// import axios from "axios"; 

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors, }, } = useForm<FieldValues>({ defaultValues: { Email: '', Password: '' }, });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { Email, Password } = data;
        setIsLoading(true);

        try {
            // TODO: Replace with actual Login API Endpoint
            // const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/Auth/login`, { ... });
            // if (response.status === 200) { login(response.data.user, response.data.accessToken); ... }

            toast.error("Login API integration pending");
            console.log("Login data:", Email, Password);

        } catch (error) {
            console.log(error);
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSign = async () => {
        toast.error("Google Login not yet implemented with new API");
    }

    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!" />
            <Input id="Email" label="Email" type="email" disabled={isLoading} register={register} errors={errors} required />
            <Input id="Password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3 mb-12 md:mb-0">
            <hr />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={handleGoogleSign} />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <p>Are you new here?
                    <span onClick={onToggle} className="text-neutral-800 cursor-pointer  hover:underline"> Create an account</span>
                </p>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModal;