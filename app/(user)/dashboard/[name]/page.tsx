
import DefaultLayout from '@/components/layout/Layout/DefaultLayout';
import { SATable } from '@/components/layout/SATable';
import React from 'react';

interface Params {
  name: string;
}

interface PageProps {
  params: Promise<Params>;
}

const Page = async ({ params }: PageProps) => {
  const { name } = await params;

  return (
    <DefaultLayout>
      <section className='h-full w-full'>
        <SATable name={name} />
      </section>
    </DefaultLayout>
  );
};

export default Page;