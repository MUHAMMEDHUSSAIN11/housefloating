'use client';

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
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
import useAuth from "@/app/hooks/useAuth";
import SignUp from "@/app/actions/SignUp/SignUp";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, }, } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      userName: '',
      mobileNumber: ''
    },
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const isPasswordEmpty = !passwordValue;
  const isConfirmPasswordEmpty = !confirmPasswordValue;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    const { email, password, userName, mobileNumber } = data;

    try {

      const response = await SignUp({
        email,
        password,
        userName,
        mobileNumber
      });

      if (response && response.status === 200 && response.data) {
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
    signIn('google');
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-2">
      <Heading title="Welcome to Housefloating" subtitle="Create an account!" />
      <Input
        id="userName"
        label="Name"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        validation={{
          required: "Name is required",
          minLength: { value: 3, message: "Name must be at least 3 characters" },
        }}
      />

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
            minLength: { value: 6, message: "Password must be at least 6 characters" },
            pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/, message: "Password must contain at least one letter and one number" },
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
      <div className="relative">
        <Input
          id="confirmPassword"
          label="Confirm Password"
          disabled={isLoading}
          type={showConfirmPassword ? "text" : "password"}
          register={register}
          errors={errors}
          validation={{
            required: "Confirm password is required",
            validate: (value: string) =>
              value === passwordValue || "Passwords do not match",
          }}
        />
        {!isConfirmPasswordEmpty && (
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute top-7 right-5 hover:cursor-pointer`}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      <Input id="mobileNumber" label="Mobile Number" disabled={isLoading} register={register} errors={errors} validation={{
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit mobile number",
        },
      }} />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-2  mb-16 md:mb-0">
      <hr className='border border-gray-300' />
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
