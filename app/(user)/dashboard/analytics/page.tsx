import AnalyticsData from '@/components/layout/analytics/AnalyticsData'
import DefaultLayout from '@/components/layout/Layout/DefaultLayout'
import React from 'react'

const Page = () => {
    return (
        <DefaultLayout>
            <div className="w-full py-10 h-screen space-y-12 md:space-y-20">
                <h4 className='text-xl md:text-5xl font-semibold text-center'>Analytics</h4>
                <AnalyticsData />
            </div>
        </DefaultLayout>
    )
}

export default Page