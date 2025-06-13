"use client";

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import react-apexcharts to disable SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const LineCharts = () => {
  return (
    <div>LineCharts</div>
  )
}
