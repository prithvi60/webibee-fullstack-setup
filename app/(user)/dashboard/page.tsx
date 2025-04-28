import DefaultLayout from '@/components/layout/Layout/DefaultLayout'
import React from 'react'

const page = () => {
    return (
        <DefaultLayout>
            <div className="flex justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-screen">
                <h4>Dashboard</h4>
            </div>
        </DefaultLayout>
    )
}

export default page
