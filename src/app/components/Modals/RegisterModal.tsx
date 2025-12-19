'use client';

import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Input from "../Inputs/Input";
import Heading from "../Misc/Heading";
import Button from "../Misc/Button";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "@/app/hooks/useAuth";

const RegisterModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Use custom auth hook

  const { register, handleSubmit, formState: { errors, }, } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      userName: '',
      mobileNumber: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const { email, password, confirmPassword, userName, mobileNumber } = data;

    if (!userName || userName.trim() === '') {
      toast.error("Name is required");
      setIsLoading(false);
      return;
    }

    if (!mobileNumber || mobileNumber.trim() === '') {
      toast.error("Mobile Number is required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 6 characters long and contain at least one letter and one number");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API;
      if (!apiUrl) {
        throw new Error("API URL is not defined");
      }

      const response = await axios.post(`${apiUrl}/api/Auth/guestSignUp`, {
        email,
        password,
        userName,
        mobileNumber
      });

      if (response.status === 200 && response.data) {
        const { user, accessToken } = response.data.data;

        if (user && accessToken) {
          login(user, accessToken);
          toast.success("User Created Successfully");
          registerModal.onClose();
          router.refresh();
        } else {
          console.error("Missing user or accessToken in response", response.data);
          toast.error("Signup succeeded but invalid response structure");
        }
      } else {
        toast.error("Registration failed");
      }
    } catch (error: any) {
      console.error("Signup error", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSign = async () => {
    // Placeholder for Google Login integration
    toast.error("Google Login not yet implemented with new API");
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-2">
      <Heading title="Welcome to Housefloating" subtitle="Create an account!" />
      <Input id="userName" label="Name" type="text" disabled={isLoading} register={register} errors={errors} required />
      <Input id="email" label="Email" type="email" disabled={isLoading} register={register} errors={errors} required />
      <Input id="mobileNumber" label="Mobile Number" type="tel" disabled={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
      <Input id="confirmPassword" label="Confirm Password" type="password" disabled={isLoading} register={register} errors={errors} required />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-2  mb-16 md:mb-0">
      <hr />
      <Button outline label="Continue with Google" icon={FcGoogle} onClick={handleGoogleSign} />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p>Already have an account?
          <span onClick={onToggle} className="text-neutral-800 cursor-pointer hover:underline">Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
