import React from 'react'

const Page = async ({ params }) => {
    const { service } = await params
    return (
        <div className="grid grid-cols-1 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 text-xl md:text-5xl sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h4>{service.replace(/-/g, " ")}</h4>
        </div>
    )
}

export default Page
