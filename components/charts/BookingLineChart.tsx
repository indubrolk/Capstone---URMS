"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import './ChartConfig'; // Ensure registration
import { ChartOptions, ChartData } from 'chart.js';

interface LineChartProps {
  data: ChartData<'line'>;
  title?: string;
}

export const BookingLineChart: React.FC<LineChartProps> = ({ data, title }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Inter, sans-serif', weight: 'bold' as any },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' as any }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 14, weight: 'bold' as any },
        bodyFont: { size: 12 },
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(226, 232, 240, 0.5)'
        },
        ticks: {
          stepSize: 1,
          font: { family: 'Inter, sans-serif' }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: 'Inter, sans-serif' }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
};
