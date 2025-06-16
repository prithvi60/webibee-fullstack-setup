"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../UI/Loader";
import { GENERATE_OTP } from "@/utils/Queries";
import { useMutation } from "@apollo/client";

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type EmailFields = z.infer<typeof emailSchema>;
type OtpFields = z.infer<typeof otpSchema>;

export const OTPLogin = () => {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [generateOtp, { loading }] = useMutation(GENERATE_OTP);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register: registerEmail,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        reset: resetEmailForm,
    } = useForm<EmailFields>({
        resolver: zodResolver(emailSchema),
    });

    const {
        register: registerOtp,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
    } = useForm<OtpFields>({
        resolver: zodResolver(otpSchema),
    });

    const onEmailSubmit = async (data: EmailFields) => {
        try {
            setError("");
            setEmail(data.email);
            setStep("otp");
            resetEmailForm();
            const { data: result } = await generateOtp({
                variables: { email: data.email },
            });

            if (result.generateOtp.success) {
                resetEmailForm();
                const emailResponse = await fetch("/api/otpmail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                        otp: result.generateOtp.otp,
                        expiryTime: result.generateOtp.expiresAt
                    }),
                });

                await emailResponse.json();

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.text();
                    throw new Error(
                        `Email API Error: ${emailResponse.status} ${errorData}`
                    );
                }
                toast.success("OTP sent to your email", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #499d49",
                        padding: "16px",
                        color: "#499d49",
                    },
                    iconTheme: {
                        primary: "#499d49",
                        secondary: "#FFFAEE",
                    },
                });
            } else {
                throw new Error(result.generateOtp.message);
            }
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
            toast.error(err.message || "Failed to send OTP", {
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

    const onOtpSubmit = async (data: OtpFields) => {
        try {
            setError("");

            const result = await signIn("credentials", {
                identifier: email,
                credential: data.otp,
                method: "otp",
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            toast.success("Logged in successfully", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #499d49",
                    padding: "16px",
                    color: "#499d49",
                },
                iconTheme: {
                    primary: "#499d49",
                    secondary: "#FFFAEE",
                },
            });
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid OTP");
            toast.error(err.message || "Invalid OTP", {
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
        <div className="px-4 md:px-6 space-y-7 relative">
            {step === "email" ? (
                <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-7">
                    <div className="mb-4 relative">
                        <label
                            htmlFor="otp-email"
                            className="mb-2.5 block font-medium text-black"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="otp-email"
                                placeholder="Enter your email"
                                className="w-full border border-stroke bg-transparent py-2 px-2 rounded-lg text-black outline-hidden focus:border-primary focus-visible:shadow-none"
                                {...registerEmail("email")}
                            />
                        </div>
                        {emailErrors.email && (
                            <div className="absolute -bottom-7 left-0 w-full text-xs md:text-base text-red-500 font-semibold text-center mt-1">
                                {emailErrors.email.message}
                            </div>
                        )}
                    </div>

                    <button
                        // disabled={loading}
                        type="submit"
                        className={`w-full cursor-pointer rounded-md p-2 text-white bg-blue-700 transition bg-success font-semibold ${loading
                            ? "bg-opacity-40 cursor-not-allowed"
                            : "hover:bg-opacity-90"
                            }`}
                    >
                        {"Send OTP"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-7">
                    <div className="mb-4 relative">
                        <label
                            htmlFor="otp-code"
                            className="mb-2.5 block font-medium text-black"
                        >
                            Enter OTP
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="otp-code"
                                placeholder="Enter 6-digit OTP"
                                className="w-full border border-stroke bg-transparent py-2 px-2 rounded-lg text-black outline-hidden focus:border-primary focus-visible:shadow-none"
                                {...registerOtp("otp")}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-center">OTP sent to {email}</p>
                        {otpErrors.otp && (
                            <div className="absolute -bottom-4 left-0 w-full text-xs md:text-sm text-red-500 font-semibold text-center mt-1">
                                {otpErrors.otp.message}
                            </div>
                        )}
                    </div>

                    <div className="block">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full cursor-pointer rounded-md p-2.5 text-white bg-blue-700 transition bg-success font-semibold hover:bg-opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {"Verify OTP"}
                        </button>
                    </div>
                </form>
            )}

            {error && (
                <div className="absolute -bottom-6 text-xs md:text-sm w-full left-1/2 -translate-x-1/2 text-red-500 font-semibold text-center">
                    {error}
                </div>
            )}
        </div>
    );
};
