import { BasicFAQ } from '@/components/layout/faq/FaqAccordion'
import { FaqForm } from '@/components/layout/faq/FaqForm'
import DefaultLayout from '@/components/layout/Layout/DefaultLayout'
import React from 'react'

const page = () => {

    return (
        <DefaultLayout>
            <section className='h-full w-full'>
                <BasicFAQ />
                <FaqForm />
            </section>
        </DefaultLayout>
    )
}

export default page
