"use client"
import React, { useCallback } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from '@apollo/client';
import { SUBSCRIBE_PLAN_MUTATION } from '@/utils/Queries';
import { useSession } from 'next-auth/react';
const PricingCard = ({ amount, productName, plan }: { amount: number, productName: string, plan?: boolean }) => {
    const { data: session } = useSession()
    const [subscribePlan] = useMutation(SUBSCRIBE_PLAN_MUTATION);
    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    const email = session?.user?.email || "";
    // console.log(email, "email in pricing card");

    const handleDownload = useCallback(async () => {
        try {
            // First validate session and email
            if (!email) {
                throw new Error("User email not available. Please log in.");
            }

            // Initialize Stripe
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe failed to initialize.");
            }

            const currentPath = window.location.origin + window.location.pathname;

            // Create a Checkout Session
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    currency: "inr",
                    redirectUrl: currentPath,
                    productName
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create Stripe Checkout session");
            }

            const { sessionId } = await response.json();

            // If this is a plan subscription, call the mutation
            if (plan) {
                const { data, errors } = await subscribePlan({
                    variables: { email },
                    onError: (error) => {
                        console.error("Mutation error:", error);
                        throw error;
                    }
                });

                if (errors) {
                    throw new Error(errors[0].message);
                }
            }

            // Redirect to Stripe Checkout
            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

            if (stripeError) {
                throw stripeError;
            }
        } catch (error) {
            console.error("Error during payment process:", error);
            alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
        }
    }, [stripePromise, amount, productName, plan, email, subscribePlan]);

    return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8">
            <h5 className="mb-4 text-xl font-medium text-gray-500">Standard plan</h5>
            <div className="flex items-baseline text-gray-900">
                <span className="text-3xl font-semibold">$</span>
                <span className="text-5xl font-extrabold tracking-tight">49</span>
                <span className="ms-1 text-xl font-normal text-gray-500">/month</span>
            </div>
            <ul role="list" className="space-y-5 my-7">
                <li className="flex items-center">
                    <svg className="shrink-0 w-4 h-4 text-blue-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">2 team members</span>
                </li>
                <li className="flex">
                    <svg className="shrink-0 w-4 h-4 text-blue-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">20GB Cloud storage</span>
                </li>
                <li className="flex">
                    <svg className="shrink-0 w-4 h-4 text-blue-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">Integration help</span>
                </li>
                <li className="flex line-through decoration-gray-500">
                    <svg className="shrink-0 w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">Sketch Files</span>
                </li>
                <li className="flex line-through decoration-gray-500">
                    <svg className="shrink-0 w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">API Access</span>
                </li>
                <li className="flex line-through decoration-gray-500">
                    <svg className="shrink-0 w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">Complete documentation</span>
                </li>
                <li className="flex line-through decoration-gray-500">
                    <svg className="shrink-0 w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    <span className="text-base font-normal leading-tight text-gray-500 ms-3">24×7 phone & email support</span>
                </li>
            </ul>
            <button onClick={handleDownload} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center cursor-pointer">Choose plan</button>
        </div>
    )
}

export default PricingCard