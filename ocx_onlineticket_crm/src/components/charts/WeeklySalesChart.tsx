"use client";
import { useState, useEffect } from "react";

interface WeeklySalesData {
  time: string;
  revenue: number;
  tickets_sold: number;
  events_created: number;
  organizations_created: number;
}

interface WeeklySalesChartProps {
  data: WeeklySalesData[];
  loading?: boolean;
}

export default function WeeklySalesChart({ data, loading = false }: WeeklySalesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const formatWeek = (dateString: string) => {
    const date = new Date(dateString);
    const weekNumber = Math.ceil((date.getDate() + date.getDay()) / 7);
    return `W${weekNumber}`;
  };

  const getMaxRevenue = (data: WeeklySalesData[]) => {
    if (data.length === 0) return 0;
    return Math.max(...data.map(d => d.revenue));
  };

  const getYAxisLabels = (data: WeeklySalesData[]) => {
    const maxRevenue = getMaxRevenue(data);
    if (maxRevenue === 0) return ['0', '0', '0', '0', '0'];
    
    const step = maxRevenue / 4;
    return [
      '0',
      formatCompactCurrency(Math.round(step)),
      formatCompactCurrency(Math.round(step * 2)),
      formatCompactCurrency(Math.round(step * 3)),
      formatCompactCurrency(Math.round(maxRevenue))
    ];
  };

  const getYAxisPositions = () => {
    return [0, 25, 50, 75, 100];
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Weekly Sales
          </h3>
        </div>
        <div className="h-[180px] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Weekly Sales
        </h3>
        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
            />
          </svg>
        </button>
      </div>
      <div className="max-w-full mt-4">
        <div className="w-full">
          <div className="h-[180px] w-full relative">
            {data.length > 0 ? (
              <>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full w-8 text-xs text-gray-500 dark:text-gray-400">
                  {getYAxisLabels(data).reverse().map((label, index) => {
                    const position = getYAxisPositions()[index];
                    return (
                      <div 
                        key={index} 
                        className="absolute text-right text-xs transform -translate-y-1/2 pr-1"
                        style={{ top: `${100 - position}%` }}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
                
                {/* Chart bars */}
                <div className="ml-10 h-full flex items-end justify-between px-2 pb-4 relative z-10">
                  {data.map((item, index) => {
                    const maxRevenue = getMaxRevenue(data);
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex flex-col items-center h-full">
                        <div className="flex-1 flex items-end justify-center">
                          <div 
                            className="w-4 bg-purple-500 rounded-t-sm transition-all duration-300 hover:bg-purple-600 relative group"
                            style={{ 
                              height: `${height}%`, 
                              minHeight: '4px',
                              alignSelf: 'flex-end'
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-center">
                          {formatWeek(item.time)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Grid lines */}
                <div className="absolute left-10 top-0 h-full w-full pointer-events-none">
                  {getYAxisPositions().map((position, index) => (
                    <div
                      key={index}
                      className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                      style={{ top: `${100 - position}%` }}
                    ></div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 