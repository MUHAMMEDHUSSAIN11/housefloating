'use client';

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../Inputs/Input";
import Heading from "../Misc/Heading";
import Button from "../Misc/Button";
import { useSignInWithEmailAndPassword, useSignInWithFacebook, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/app/firebase/clientApp";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_ERRORS } from "@/app/firebase/errors";


 

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);
    const [signInWithEmailAndPassword,user,loading,error] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle,googleUserCred,googleLoading,googleerror] = useSignInWithGoogle(auth);
    const [SignInWithFacebook,fbUserCred,fbLoading,fberror] = useSignInWithFacebook(auth);

    const { register, handleSubmit, formState: { errors, }, } = useForm<FieldValues>({ defaultValues: { Email: '', Password: '' }, });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { Email, Password } = data;
        setIsLoading(true);
        if(error){
            const error = null;
        }
        try {
            const result = await signInWithEmailAndPassword(Email, Password);
            if(result){
                toast.success("Logged in");
                loginModal.onClose();
            }
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      };
  

      const handleGoogleSign =  async () => {
        const isGooglesignSuccess =  await signInWithGoogle()
        if(isGooglesignSuccess){
         loginModal.onClose();
         toast.success("Logged in")
        }
       }
       const handleFbSign =  async () => {
         const isFBsignSuccess =  await SignInWithFacebook()
         if(isFBsignSuccess){
          loginModal.onClose();
          toast.success("Logged in")
         }
        }
    
const createGoogleUserDocument = async (user:User) =>{
    const userDocRef = doc(firestore,'Users',user.uid)
    await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))
  }
  useEffect(()=>{
    if(googleUserCred){
      createGoogleUserDocument(googleUserCred?.user)
  }
  },[googleUserCred])
  
  
  
  const createFbUserDocument = async (user:User) =>{
    const userDocRef = doc(firestore,'Users',user.uid)
    await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))
  }
  useEffect(()=>{
    if(fbUserCred){
      createFbUserDocument(fbUserCred?.user)
  }
  },[fbUserCred])
  

    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!"/>
            <Input id="Email" label="Email" type="email" disabled={isLoading} register={register} errors={errors} required/>
            <Input id="Password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required/>
            {error&& <p className="text-center text-red-500 text-xs">{FIREBASE_ERRORS['Firebase:Error (auth/user-not-found).']}</p>}
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={handleGoogleSign} />
            <Button outline label="Continue with Facebook" icon={AiFillFacebook} onClick={handleFbSign} />
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