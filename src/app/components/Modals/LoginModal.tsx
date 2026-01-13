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
import Login from "@/app/actions/Login/Login";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, }, } = useForm<FieldValues>({ defaultValues: { email: '', password: '' }, });

    const passwordValue = watch("password");
    const isPasswordEmpty = !passwordValue;
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { email, password } = data;
        setIsLoading(true);

        try {
            const response = await Login({
                email: email,
                password: password,
            });

            if (response && response.status === 200 && response.data) {
                const { user, accessToken } = response.data.data;

                if (user && accessToken) {
                    login(user, accessToken);
                    toast.success("Login Successful");
                    loginModal.onClose();
                    router.refresh();
                } else {
                    console.error("Missing user or accessToken in response", response.data);
                    toast.error("Signin succeeded but invalid response structure");
                }
            } else {
                toast.error("Login failed");
            }
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
            <Input
                id="email"
                label="Email Id"
                type="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                validation={{
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                    },
                }}
            />
            <div className="relative">
                <Input
                    id="password"
                    label="Password"
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Password is required",
                    }}
                />
                {!isPasswordEmpty && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute top-7 right-5 hover:cursor-pointer`}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                )}
            </div>
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