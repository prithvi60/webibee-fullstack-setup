import FeatureUsage from '@/components/layout/analytics/FeatureUsage'
import MonthlyGrowth from '@/components/layout/analytics/MonthlyGrowth'
import TrafficSources from '@/components/layout/analytics/TrafficSources'
import UserRegion from '@/components/layout/analytics/UserRegion'
import WeeklyUserActivity from '@/components/layout/analytics/WeeklyUserActivity'
import DefaultLayout from '@/components/layout/Layout/DefaultLayout'
import React from 'react'

const Page = () => {
    return (
        <DefaultLayout>
            <div className="w-full py-10 h-screen space-y-12 md:space-y-20">
                <h4 className='text-xl md:text-5xl font-semibold text-center'>Analytics</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <WeeklyUserActivity />
                    <TrafficSources />
                    <MonthlyGrowth />
                    <FeatureUsage />
                    <UserRegion />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page