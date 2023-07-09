'use client';

import { AiFillFacebook } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Input from "../Inputs/Input";
import Heading from "../Misc/Heading";
import Button from "../Misc/Button";
import { FIREBASE_ERRORS } from "@/app/firebase/errors";
import { useCreateUserWithEmailAndPassword, useSignInWithFacebook, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/app/firebase/clientApp";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const [createUserWithEmailAndPassword,userCred,loading,userError] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle,googleUserCred,googleLoading,googleerror] = useSignInWithGoogle(auth);
  const [SignInWithFacebook,fbUserCred,fbLoading,fberror] = useSignInWithFacebook(auth);

  const { register, handleSubmit, formState: { errors, }, } = useForm<FieldValues>({ defaultValues: { email: '', password: '' }, });


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (userError) {
      const userError = null;
    }

    const { email, password, confirmPassword } = data;

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    const result = await createUserWithEmailAndPassword(email, password);
    setIsLoading(false);
    if (result) {
      registerModal.onClose();
      toast.success("User Created Succesfully");
    }
  }

  const handleGoogleSign = async () => {
    const isGooglesignSuccess = await signInWithGoogle()
    if (isGooglesignSuccess) {
      registerModal.onClose();
      toast.success("Logged in")
    }
  }
  const handleFbSign = async () => {
    const isFBsignSuccess = await SignInWithFacebook()
    if (isFBsignSuccess) {
      registerModal.onClose();
      toast.success("Logged in")
    }
  }

  // Create UserDocument in Database
  const createUserDocument = async (user: User) => {
    await addDoc(collection(firestore, "Users"), JSON.parse(JSON.stringify(user)))
    setIsLoading(false);
    registerModal.onClose();
  }
  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred?.user)
    }
  }, [userCred])



  const createGoogleUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'Users', user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }
  useEffect(() => {
    if (googleUserCred) {
      createGoogleUserDocument(googleUserCred?.user)
    }
  }, [googleUserCred])



  const createFbUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'Users', user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }
  useEffect(() => {
    if (fbUserCred) {
      createFbUserDocument(fbUserCred?.user)
    }
  }, [fbUserCred])


  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-3">
      <Heading title="Welcome to Housefloating" subtitle="Create an account!" />
      <Input id="email" label="Email" type="email" disabled={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
      <Input id="confirmPassword" label="Confirm Password" type="password" disabled={isLoading} register={register} errors={errors} required />
      {(userError || googleerror || fberror) && (<p className="text-center text-red-500 text-xs">{FIREBASE_ERRORS['Firebase: Error (auth/email-already-in-use).']}</p>)}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-3 mt-1">
      <hr />
      <Button outline label="Continue with Google" icon={FcGoogle} onClick={handleGoogleSign} />
      <Button outline label="Continue with Facebook" icon={AiFillFacebook} onClick={handleFbSign} />
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

