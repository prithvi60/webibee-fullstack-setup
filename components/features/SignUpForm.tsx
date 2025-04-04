"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { SIGN_UP } from "@/lib/Queries";
import { Loader } from "../ui/Loader";


// Define the validation schema using Zod
const schema = z
    .object({
        name: z
            .string()
            .min(3, { message: "name must be at least 3 characters" })
            .max(70, { message: "name must be less than 30 characters" }),
        email: z.string().email({ message: "Invalid email address" }),
        phone_number: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(10, "Phone number must not exceed 10 digits"),
        address: z.string().min(10, "Address is required"),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter",
            })
            .regex(/[a-z]/, {
                message: "Password must contain at least one lowercase letter",
            })
            .regex(/\d/, { message: "Password must contain at least one number" })
            .regex(/[\W_]/, {
                message: "Password must contain at least one special character",
            }),
        confirmPassword: z.string().min(6, {
            message: "Confirm Password must be at least 6 characters",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type FormFields = z.infer<typeof schema>;

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [signUp] = useMutation(SIGN_UP);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // console.log("submitted", data);

        try {
            const { data: result } = await signUp({ variables: { ...data } });

            if (result) {
                reset()
                router.push("/sign-in");
                toast.success("Signed up successfully", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #65a34e",
                        padding: "16px",
                        color: "#65a34e",
                    },
                    iconTheme: {
                        primary: "#65a34e",
                        secondary: "#FFFAEE",
                    },
                });
            } else {
                setError("root", { message: "Invalid Sign Up" });
                toast.error("Invalid Sign Up", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #EB1C23",
                        padding: "16px",
                        color: "#EB1C23",
                    },
                    iconTheme: {
                        primary: "#EB1C23",
                        secondary: "#FFFAEE",
                    },
                });
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            const errorMessage = (error as Error).message;
            setError("root", { message: errorMessage });
            toast.error(errorMessage, {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #EB1C23",
                    padding: "16px",
                    color: "#EB1C23",
                },
                iconTheme: {
                    primary: "#EB1C23",
                    secondary: "#FFFAEE",
                },
            });
        }
    };

    return (
        <div className="rounded-md border-4 border-[#ECEFF1] bg-white shadow-xl mt-14 xl:m-4 mx-5">
            <div className="flex flex-wrap items-start relative">

                <div className="w-full py-2 sm:px-6 border-2">
                    <div className="w-full px-4 py-4 sm:p-12.5 xl:p-17.5 text-[#1E318D]">
                        <h2 className="mb-6 text-lg font-bold text-[#1E318D] md:text-2xl">
                            Create a New Account
                        </h2>
                        {/* SubmissionForm */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8 relative"
                        >
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Name
                                    </label>
                                    <div className="relative grow">
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("name")}
                                        />
                                    </div>
                                </div>
                                {errors.name && (
                                    <div className="absolute -bottom-6 left-0 w-full text-xs md:text-xl text-red-500 font-semibold text-center mt-1">
                                        {errors.name.message}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-3 items-center ">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Email
                                    </label>
                                    <div className="relative grow">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("email")}
                                        />
                                    </div>
                                </div>
                                {errors.email && (
                                    <div className="text-red-500 font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-xl mt-1">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Phone Number
                                    </label>
                                    <div className="relative grow">
                                        <input
                                            type="text"
                                            placeholder="Enter Your Ph.No."
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("phone_number")}
                                        />
                                    </div>
                                </div>
                                {errors.phone_number && (
                                    <span className="text-red-500 font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-xl mt-2">
                                        {errors.phone_number.message}
                                    </span>
                                )}
                            </div>
                            {/* Address */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Address
                                    </label>
                                    <div className="relative grow">
                                        <textarea
                                            placeholder="Enter Your address"
                                            rows={3}
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("address")}
                                        />
                                    </div>
                                </div>
                                {errors.address && (
                                    <span className="text-red-500 font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-xl mt-2">
                                        {errors.address.message}
                                    </span>
                                )}
                            </div>
                            {/* password */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Password
                                    </label>
                                    <div className="relative grow">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="6+ Characters, 1 Capital letter"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("password")}
                                        />
                                        <span
                                            className="hidden sm:block absolute right-4 top-2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    stroke="#ECEFF1"
                                                    strokeOpacity={"0.4"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g
                                                        stroke="#000"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m1 12s4-8 11-8 11 8 11 8" />
                                                        <path d="m1 12s4 8 11 8 11-8 11-8" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </g>
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    stroke="#ECEFF1"
                                                    strokeOpacity={"0.4"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g
                                                        stroke="#000"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m2 2 20 20" />
                                                        <path d="m6.71277 6.7226c-3.04798 2.07267-4.71277 5.2774-4.71277 5.2774s3.63636 7 10 7c2.0503 0 3.8174-.7266 5.2711-1.7116m-6.2711-12.23018c.3254-.03809.6588-.05822 1-.05822 6.3636 0 10 7 10 7s-.6918 1.3317-2 2.8335" />
                                                        <path d="m14 14.2362c-.5308.475-1.2316.7639-2 .7639-1.6569 0-3-1.3431-3-3 0-.8237.33193-1.5698.86932-2.11192" />
                                                    </g>
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {errors.password && (
                                    <div className="text-red-500 font-semibold text-center absolute -bottom-6 left-0 w-full text-xs md:text-xl mt-1">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                            {/* re-type password */}
                            <div className="relative">
                                <div className="flex gap-3 items-center">
                                    <label className="w-[45%] md:w-[30%] block font-medium text-[#1E318D] text-lg md:text-xl">
                                        Re-type Password
                                    </label>
                                    <div className="relative grow">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            className="w-full  border border-stroke bg-transparent py-2 pl-6 placeholder:text-lg sm:placeholder:text-base sm:pr-10 text-[#1E318D] outline-hidden focus:border-blue-700 focus-visible:shadow-none"
                                            {...register("confirmPassword")}
                                        />
                                        <span
                                            className="hidden sm:block absolute right-4 top-2 cursor-pointer"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    stroke="#ECEFF1"
                                                    strokeOpacity={"0.4"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g
                                                        stroke="#000"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m1 12s4-8 11-8 11 8 11 8" />
                                                        <path d="m1 12s4 8 11 8 11-8 11-8" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </g>
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    stroke="#ECEFF1"
                                                    strokeOpacity={"0.4"}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g
                                                        stroke="#000"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m2 2 20 20" />
                                                        <path d="m6.71277 6.7226c-3.04798 2.07267-4.71277 5.2774-4.71277 5.2774s3.63636 7 10 7c2.0503 0 3.8174-.7266 5.2711-1.7116m-6.2711-12.23018c.3254-.03809.6588-.05822 1-.05822 6.3636 0 10 7 10 7s-.6918 1.3317-2 2.8335" />
                                                        <path d="m14 14.2362c-.5308.475-1.2316.7639-2 .7639-1.6569 0-3-1.3431-3-3 0-.8237.33193-1.5698.86932-2.11192" />
                                                    </g>
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <div className="text-red-500 font-semibold text-center absolute -bottom-8 sm:-bottom-6 left-0 w-full text-xs md:text-xl mt-1">
                                        {errors.confirmPassword.message}
                                    </div>
                                )}
                            </div>
                            {/* Submit Button */}
                            <div>
                                <button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                    className={`w-full cursor-pointer rounded-md p-4 text-white transition bg-success font-semibold bg-blue-600 mb-5 ${!isValid || isSubmitting
                                        ? "bg-opacity-40 cursor-not-allowed"
                                        : "hover:bg-opacity-90"
                                        }`}
                                >
                                    {isSubmitting ? <Loader /> : "Sign up"}
                                </button>
                            </div>

                            <div className="text-center -mt-2! ">
                                <p>
                                    Already have an account?{" "}
                                    <Link href="/sign-in" className="text-blue-700 text-lg md:text-xl font-semibold underline underline-offset-4 hover:text-blue-700/70">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                            {errors.root && (
                                <div className="absolute -bottom-10 text-lg md:text-xl w-full left-1/2 -translate-x-1/2 text-red-500 font-semibold text-center mt-5">
                                    {errors.root.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
