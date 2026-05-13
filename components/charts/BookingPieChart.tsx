"use client";

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './ChartConfig';
import { ChartOptions, ChartData } from 'chart.js';

interface PieChartProps {
  data: ChartData<'doughnut'>;
  title?: string;
}

export const BookingPieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { weight: 'bold' as any }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' as any }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};
