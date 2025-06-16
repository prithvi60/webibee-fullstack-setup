"use client";

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import react-apexcharts to disable SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ApexChartProps {
  type?: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'heatmap' | 'candlestick' | 'radialBar';
  height?: number;
  width?: number | string;
  series: ApexOptions['series'];
  options: ApexOptions;
}

const ApexChart = ({ type = 'line', height = 350, width = 500, series, options }: ApexChartProps) => {
  return (
    <div>
      <Chart
        options={options}
        series={series}
        type={type}
        height={height}
        width={width}
      />
    </div>
  );
};

export default ApexChart;
