'use client';

import { FieldErrors, FieldValues, UseFormRegister, RegisterOptions } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    min?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    optional?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    validation?: RegisterOptions;
}

const Input: React.FC<InputProps> = ({ 
    id, 
    label, 
    type = "text", 
    min,
    disabled, 
    formatPrice, 
    register, 
    required, 
    optional,
    errors,
    validation
}) => {
    // Merge validation rules with required prop
    const validationRules = validation || {};
    if (required && !validation?.required) {
        validationRules.required = `${label} is required`;
    }

    return (
        <div className="w-full relative">
            {formatPrice && (
                <BiDollar size={24} className="text-neutral-700 absolute top-5 left-2" />
            )}
            <input 
                id={id} 
                disabled={disabled} 
                {...register(id, validationRules)} 
                placeholder=" " 
                type={type}
                min={min}
                className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
                    ${formatPrice ? 'pl-9' : 'pl-4'}
                    ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
                    ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
                `}
            />
            <label 
                className={`absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] 
                    ${formatPrice ? 'left-9' : 'left-4'} 
                    peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75
                    peer-focus:-translate-y-4
                    ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
                `}
            >
                {label}
                {!optional && !required && <span className="text-rose-500 ml-1">*</span>}
                {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
            {errors[id] && (
                <span className="text-rose-500 text-xs mt-1 block">
                    {errors[id]?.message as string}
                </span>
            )}
        </div>
    );
}

export default Input;