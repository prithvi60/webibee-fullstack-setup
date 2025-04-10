"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import Loader from "../UI/Loader";


const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormFields = z.infer<typeof schema>;


export const CredentialsSignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    // handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  // const onSubmit: SubmitHandler<FormFields> = async (data) => {

  //   const returnUrl = typeof window !== 'undefined'
  //     ? localStorage.getItem('returnUrl') || '/'
  //     : '/';

  //   // console.log("returnUrl", returnUrl)
  //   try {
  //     const result = await signIn("credentials", {
  //       redirect: false,
  //       ...data
  //     });

  //     if (result?.error) {
  //       setError("root", { message: result.error });
  //       toast.error(result.error, {
  //         position: "top-right",
  //         duration: 3000,
  //         style: {
  //           border: "1px solid #EB1C23",
  //           padding: "16px",
  //           color: "#EB1C23",
  //         },
  //         iconTheme: {
  //           primary: "#EB1C23",
  //           secondary: "#FFFAEE",
  //         },
  //       });
  //     } else if (result?.ok) {
  //       reset();
  //       // Wait for the session to be updated
  //       await new Promise((resolve) => setTimeout(resolve, 100));

  //       if (returnUrl) {
  //         localStorage.removeItem("returnUrl");
  //         window.location.href = returnUrl;
  //       } else {
  //         window.location.href = "/";
  //       }
  //       toast.success("Logged in successfully", {
  //         position: "top-right",
  //         duration: 3000,
  //         style: {
  //           border: "1px solid #499d49",
  //           padding: "16px",
  //           color: "#499d49",
  //         },
  //         iconTheme: {
  //           primary: "#499d49",
  //           secondary: "#FFFAEE",
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("An unexpected error occurred:", error);
  //     const errorMessage = (error as Error).message;
  //     setError("root", { message: errorMessage });
  //     toast.error(errorMessage);
  //   }
  //   return null;
  // };
  const credentialsAction = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    const result = await signIn("credentials", data, { callbackUrl: "/" });
    if (result?.error) {
      toast.error(result.error, {
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
    } else if (result?.ok) {
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
    }
  }
  return (
    <form
      action={credentialsAction}
      // onSubmit={handleSubmit(onSubmit)}
      className="px-4 sm:px-12.5 xl:px-17.5 space-y-7 relative"
    >
      <div className="mb-4 relative">
        <label htmlFor="credentials-email" className="mb-2.5 block font-medium text-[#1E318D]">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="credentials-email"
            placeholder="Enter your email"
            className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#1E318D] outline-hidden focus:border-primary focus-visible:shadow-none"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <div className="absolute -bottom-7 left-0 w-full text-xs md:text-base text-red-500 font-semibold text-center mt-1">
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="mb-6 relative">
        <label htmlFor="credentials-password" className="mb-2.5 block font-medium text-[#1E318D]">
          Password
        </label>
        <div className="relative">
          <input
            id="credentials-password"
            type={showPassword ? "text" : "password"}
            placeholder="6+ Characters, 1 Capital letter"
            className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-[#1E318D] outline-hidden focus:border-primary focus-visible:shadow-none"
            {...register("password")}
          />

          <span
            className="absolute right-4 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#878995"
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
                stroke="#878995"
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
        {errors.password && (
          <div className="absolute -bottom-7 left-0 w-full text-xs md:text-base text-red-500 font-semibold text-center mt-1">
            {errors.password.message}
          </div>
        )}
      </div>

      <button
        disabled={isSubmitting}
        type="submit"
        className={`w-full cursor-pointer rounded-md p-4 text-white bg-blue-700 transition bg-success font-semibold ${isSubmitting
          ? "bg-opacity-40 cursor-not-allowed"
          : "hover:bg-opacity-90"
          }`}
      >
        {isSubmitting ? <Loader /> : "Log In"}
      </button>

      {errors.root && (
        <div className="absolute -bottom-6 text-lg md:text-xl w-full left-1/2 -translate-x-1/2 text-red-500 font-semibold text-center mt-5">
          {errors.root.message}
        </div>
      )}
    </form>
  )
}
