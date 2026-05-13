"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartConfig';
import { ChartOptions, ChartData } from 'chart.js';

interface BarChartProps {
  data: ChartData<'bar'>;
  title?: string;
  horizontal?: boolean;
}

export const BookingBarChart: React.FC<BarChartProps> = ({ data, title, horizontal = false }) => {
  const options: ChartOptions<'bar'> = {
    indexAxis: horizontal ? 'y' as const : 'x' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' as any }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        cornerRadius: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: !horizontal,
          color: 'rgba(226, 232, 240, 0.5)'
        }
      },
      x: {
        grid: {
          display: horizontal,
          color: 'rgba(226, 232, 240, 0.5)'
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
};
