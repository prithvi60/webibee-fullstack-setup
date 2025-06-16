"use client";
import React, { useEffect, useState } from "react";
import WeeklyUserActivity from "./WeeklyUserActivity";
import TrafficSources from "./TrafficSources";
import MonthlyGrowth from "./MonthlyGrowth";
import FeatureUsage from "./FeatureUsage";
import UserRegion from "./UserRegion";
import TopMetricsCards from "./TopMetricsCards";
import RecentActivityFeed from "./RecentActivityFeed";

const AnalyticsData = () => {
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const timer = setTimeout(() => setIsLoading(false), 500);
    //     return () => clearTimeout(timer);
    // }, []);

    // if (isLoading) {
    //     return (
    //         <div className="w-full h-[80dvh] flex flex-col justify-center items-center gap-4">
    //             <p className="text-lg font-medium text-gray-700">
    //                 Loading analytics data...
    //             </p>
    //             <p className="text-sm text-gray-500">This may take a few moments</p>
    //         </div>
    //     );
    // }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <WeeklyUserActivity />
            <TrafficSources />
            <MonthlyGrowth />
            <FeatureUsage />
            <UserRegion />
            <TopMetricsCards />
            <RecentActivityFeed />
        </div>
    );
};

export default AnalyticsData;
