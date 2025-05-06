import DefaultLayout from '@/components/layout/Layout/DefaultLayout';
import { SATable } from '@/components/layout/SATable';
import React from 'react'

const Page = async ({ params }: { params: { name: string } }) => {
  const { name } = await params;
  console.log(decodeURIComponent(name as string));
  return (
    <DefaultLayout>
      <section className='h-full w-full'>
        <SATable name={name} />
      </section>
    </DefaultLayout>
  )
}

export default Page
