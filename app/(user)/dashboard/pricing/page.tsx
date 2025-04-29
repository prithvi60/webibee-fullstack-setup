import DefaultLayout from "@/components/layout/Layout/DefaultLayout";
import PricingCard from "@/components/UI/PricingCard";
import React from "react";

const Page = () => {
    return (
        <DefaultLayout>
            <div className="flex flex-col justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-screen">
                <h4>Pricing</h4>
                <PricingCard />
            </div>
        </DefaultLayout>
    );
};

export default Page;
