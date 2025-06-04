"use client";
import React from "react";
import PricingCard from "../UI/PricingCard";
import { useQuery } from "@apollo/client";
import { GET_SUBSCRIBED_USER } from "@/utils/Queries";
import { useSession } from "next-auth/react";
import Loader from "../UI/Loader";
import {
    formatExpiryTime,
    formatExpiryTime2,
} from "../features/formatExpiryTime";

const SubscriptionPlan = () => {
    const { data: session } = useSession();
    const email = session?.user?.email || "";
    const { data: user, loading } = useQuery(GET_SUBSCRIBED_USER, {
        variables: {
            email,
        },
    });

    if (loading) {
        return (
            <div className="w-full h-96 flex justify-center items-center">
                <p className="text-black text-lg md:text-xl animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    // Check if user data exists and has getSubscribedUserByEmail
    if (!user?.getSubscribedUserByEmail) {
        return (
            <div className="flex flex-col justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-fit">
                <h4>Subscription</h4>
                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="text-lg md:text-xl text-center font-semibold">
                        <h4 className="text-gray-700">Subscription Status:</h4>
                        <p className="text-green-500 font-bold">Free Plan</p>
                    </div>
                    <div className="text-lg md:text-xl text-center text-gray-700 font-semibold">
                        <h4>Expiry Date:</h4>
                        <span className="text-blue-500 px-0.5">NaN</span>
                    </div>
                </div>
                <PricingCard amount={299} productName={"Subscription Plan"} plan={true} />
            </div>
        );
    }

    // Safely handle expiresAt
    const expiresAt = user.getSubscribedUserByEmail?.expiresAt;
    const expiryTime = formatExpiryTime2(Number(expiresAt));

    return (
        <div className="flex flex-col justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-fit">
            <h4>Subscription</h4>
            {!user.getSubscribedUserByEmail.verified ? (
                <PricingCard amount={299} productName={"Subscription Plan"} plan={true} />
            ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                    <div className="text-lg md:text-xl text-center font-semibold">
                        <h4 className="text-gray-700">Subscription Status:</h4>
                        <p className="text-green-500 font-bold">Professional Plan</p>
                    </div>
                    <div className="text-lg md:text-xl text-center text-gray-700 font-semibold">
                        <h4>Expiry Date:</h4>
                        <span className="text-blue-500 px-0.5">{expiryTime}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPlan;