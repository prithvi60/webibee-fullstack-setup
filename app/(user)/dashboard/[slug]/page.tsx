import DefaultLayout from '@/components/layout/Layout/DefaultLayout'
import React from 'react'

const page = ({ params }: { params: { slug: string } }) => {
    const { slug } = params
    return (
        <DefaultLayout>
            <div className="flex justify-center items-center p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-10 h-screen capitalize">
                <h4>{slug}</h4>
            </div>
        </DefaultLayout>
    )
}

export default page
