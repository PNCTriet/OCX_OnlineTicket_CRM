"use client";
import DashboardLayout from '@/components/layout/DashboardLayout';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Metric Group One */}
          <div className="col-span-12 xl:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
              {/* Metric 1 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <svg className="fill-gray-800 dark:fill-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.80443 5.60156C7.59109 5.60156 6.60749 6.58517 6.60749 7.79851C6.60749 9.01185 7.59109 9.99545 8.80443 9.99545C10.0178 9.99545 11.0014 9.01185 11.0014 7.79851C11.0014 6.58517 10.0178 5.60156 8.80443 5.60156ZM5.10749 7.79851C5.10749 5.75674 6.76267 4.10156 8.80443 4.10156C10.8462 4.10156 12.5014 5.75674 12.5014 7.79851C12.5014 9.84027 10.8462 11.4955 8.80443 11.4955C6.76267 11.4955 5.10749 9.84027 5.10749 7.79851ZM4.86252 15.3208C4.08769 16.0881 3.70377 17.0608 3.51705 17.8611C3.48384 18.0034 3.5211 18.1175 3.60712 18.2112C3.70161 18.3141 3.86659 18.3987 4.07591 18.3987H13.4249C13.6343 18.3987 13.7992 18.3141 13.8937 18.2112C13.9797 18.1175 14.017 18.0034 13.9838 17.8611C13.7971 17.0608 13.4132 16.0881 12.6383 15.3208C11.8821 14.572 10.6899 13.955 8.75042 13.955C6.81096 13.955 5.61877 14.572 4.86252 15.3208ZM3.8071 14.2549C4.87163 13.2009 6.45602 12.455 8.75042 12.455C11.0448 12.455 12.6292 13.2009 13.6937 14.2549C14.7397 15.2906 15.2207 16.5607 15.4446 17.5202C15.7658 18.8971 14.6071 19.8987 13.4249 19.8987H4.07591C2.89369 19.8987 1.73504 18.8971 2.05628 17.5202C2.28015 16.5607 2.76117 15.2906 3.8071 14.2549ZM15.3042 11.4955C14.4702 11.4955 13.7006 11.2193 13.0821 10.7533C13.3742 10.3314 13.6054 9.86419 13.7632 9.36432C14.1597 9.75463 14.7039 9.99545 15.3042 9.99545C16.5176 9.99545 17.5012 9.01185 17.5012 7.79851C17.5012 6.58517 16.5176 5.60156 15.3042 5.60156C14.7039 5.60156 14.1597 5.84239 13.7632 6.23271C13.6054 5.73284 13.3741 5.26561 13.082 4.84371C13.7006 4.37777 14.4702 4.10156 15.3042 4.10156C17.346 4.10156 19.0012 5.75674 19.0012 7.79851C19.0012 9.84027 17.346 11.4955 15.3042 11.4955ZM19.9248 19.8987H16.3901C16.7014 19.4736 16.9159 18.969 16.9827 18.3987H19.9248C20.1341 18.3987 20.2991 18.3141 20.3936 18.2112C20.4796 18.1175 20.5169 18.0034 20.4837 17.861C20.2969 17.0607 19.913 16.088 19.1382 15.3208C18.4047 14.5945 17.261 13.9921 15.4231 13.9566C15.2232 13.6945 14.9995 13.437 14.7491 13.1891C14.5144 12.9566 14.262 12.7384 13.9916 12.5362C14.3853 12.4831 14.8044 12.4549 15.2503 12.4549C17.5447 12.4549 19.1291 13.2008 20.1936 14.2549C21.2395 15.2906 21.7206 16.5607 21.9444 17.5202C22.2657 18.8971 21.107 19.8987 19.9248 19.8987Z"/>
                  </svg>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">3,782</h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                    <svg className="fill-current" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247L6.87329 10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125L5.37329 3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"/></svg>
                    11.01%
                  </span>
                </div>
              </div>
              {/* Metric 2 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <svg className="fill-gray-800 dark:fill-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.665 3.75621C11.8762 3.65064 12.1247 3.65064 12.3358 3.75621L18.7807 6.97856L12.3358 10.2009C12.1247 10.3065 11.8762 10.3065 11.665 10.2009L5.22014 6.97856L11.665 3.75621ZM4.29297 8.19203V16.0946C4.29297 16.3787 4.45347 16.6384 4.70757 16.7654L11.25 20.0366V11.6513C11.1631 11.6205 11.0777 11.5843 10.9942 11.5426L4.29297 8.19203ZM12.75 20.037L19.2933 16.7654C19.5474 16.6384 19.7079 16.3787 19.7079 16.0946V8.19202L13.0066 11.5426C12.9229 11.5844 12.8372 11.6208 12.75 11.6516V20.037ZM13.0066 2.41456C12.3732 2.09786 11.6277 2.09786 10.9942 2.41456L4.03676 5.89319C3.27449 6.27432 2.79297 7.05342 2.79297 7.90566V16.0946C2.79297 16.9469 3.27448 17.726 4.03676 18.1071L10.9942 21.5857L11.3296 20.9149L10.9942 21.5857C11.6277 21.9024 12.3732 21.9024 13.0066 21.5857L19.9641 18.1071C20.7264 17.726 21.2079 16.9469 21.2079 16.0946V7.90566C21.2079 7.05342 20.7264 6.27432 19.9641 5.89319L13.0066 2.41456Z"/></svg>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Orders</span>
                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">5,359</h4>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-red-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
                    <svg className="fill-current" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.31462 10.3761C5.45194 10.5293 5.65136 10.6257 5.87329 10.6257C5.8736 10.6257 5.8739 10.6257 5.87421 10.6257C6.0663 10.6259 6.25845 10.5527 6.40505 10.4062L9.40514 7.4082C9.69814 7.11541 9.69831 6.64054 9.40552 6.34754C9.11273 6.05454 8.63785 6.05438 8.34486 6.34717L6.62329 8.06753L6.62329 1.875C6.62329 1.46079 6.28751 1.125 5.87329 1.125C5.45908 1.125 5.12329 1.46079 5.12329 1.875L5.12329 8.06422L3.40516 6.34719C3.11218 6.05439 2.6373 6.05454 2.3445 6.34752C2.0517 6.64051 2.05185 7.11538 2.34484 7.40818L5.31462 10.3761Z"/></svg>
                    9.05%
                  </span>
                </div>
              </div>
            </div>
            {/* Chart One */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Sales</h3>
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"/></svg>
                </button>
              </div>
              <div className="max-w-full overflow-x-auto custom-scrollbar mt-4">
                <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                  <div className="-ml-5 h-full min-w-[650px] pl-2 xl:min-w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm" style={{height:180}}>
                    {/* Chart placeholder */}
                    Chart here
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-5 space-y-6">
            {/* Chart Two */}
            <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="shadow-default rounded-2xl bg-white px-5 pb-11 pt-5 dark:bg-gray-900 sm:px-6 sm:pt-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Target</h3>
                    <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Target you’ve set for each month</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"/></svg>
                  </button>
                </div>
                <div className="relative max-h-[195px] mt-4">
                  <div className="h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm" style={{height:140}}>
                    {/* Chart placeholder */}
                    Chart here
                  </div>
                  <span className="absolute left-1/2 top-[85%] -translate-x-1/2 -translate-y-[85%] rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">+10%</span>
                </div>
                <p className="mx-auto mt-1.5 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">You earn $3287 today, it's higher than last month. Keep up your good work!</p>
              </div>
              <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                <div>
                  <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">Target</p>
                  <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">$20K<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z" fill="#D92D20"/></svg></p>
                </div>
                <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">Revenue</p>
                  <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">$20K<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z" fill="#039855"/></svg></p>
                </div>
                <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>
                <div>
                  <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">Today</p>
                  <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">$20K<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z" fill="#039855"/></svg></p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistic block: full width row */}
          <div className="col-span-12">
            {/* Chart Three (Statistics) */}
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 mt-6">
              <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
                  <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you’ve set for each month</p>
                </div>
                <div className="flex items-start w-full gap-3 sm:justify-end">
                  <div className="inline-flex w-fit items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                    <button className="px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-theme-xs">Overview</button>
                    <button className="px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">Sales</button>
                    <button className="px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">Revenue</button>
                  </div>
                  <div className="relative w-fit">
                    <input className="datepicker h-10 w-full max-w-11 rounded-lg border border-gray-200 bg-white py-2.5 pl-[34px] pr-4 text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-hidden focus:ring-0 focus-visible:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 xl:max-w-fit xl:pl-11" placeholder="Select dates" readOnly />
                    <div className="absolute inset-0 right-auto flex items-center pointer-events-none left-4">
                      <svg className="fill-gray-700 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.66683 1.54199C7.08104 1.54199 7.41683 1.87778 7.41683 2.29199V3.00033H12.5835V2.29199C12.5835 1.87778 12.9193 1.54199 13.3335 1.54199C13.7477 1.54199 14.0835 1.87778 14.0835 2.29199V3.00033L15.4168 3.00033C16.5214 3.00033 17.4168 3.89576 17.4168 5.00033V7.50033V15.8337C17.4168 16.9382 16.5214 17.8337 15.4168 17.8337H4.5835C3.47893 17.8337 2.5835 16.9382 2.5835 15.8337V7.50033V5.00033C2.5835 3.89576 3.47893 3.00033 4.5835 3.00033L5.91683 3.00033V2.29199C5.91683 1.87778 6.25262 1.54199 6.66683 1.54199ZM6.66683 4.50033H4.5835C4.30735 4.50033 4.0835 4.72418 4.0835 5.00033V6.75033H15.9168V5.00033C15.9168 4.72418 15.693 4.50033 15.4168 4.50033H13.3335H6.66683ZM15.9168 8.25033H4.0835V15.8337C4.0835 16.1098 4.30735 16.3337 4.5835 16.3337H15.4168C15.693 16.3337 15.9168 16.1098 15.9168 15.8337V8.25033Z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-4 min-w-[700px] pl-2">
                  <div className="-ml-4 h-full min-w-[700px] pl-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm" style={{height:180}}>
                    {/* Chart placeholder */}
                    Chart here
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customers Demographic & Recent Orders side by side */}
          <div className="col-span-12 xl:col-span-6">
            {/* Map One (Customers Demographic) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 mt-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Customers Demographic</h3>
                  <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Number of customer based on country</p>
                </div>
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"/></svg>
                </button>
              </div>
              <div className="border-gary-200 my-6 overflow-hidden rounded-2xl border bg-gray-50 px-4 py-6 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                <div className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm">Map here</div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-full max-w-8 items-center rounded-full">
                      <Image src="/images/country/country-01.svg" alt="usa" width={32} height={32} />
                    </div>
                    <div>
                      <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">USA</p>
                      <span className="block text-theme-xs text-gray-500 dark:text-gray-400">2,379 Customers</span>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[140px] items-center gap-3">
                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                      <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white"></div>
                    </div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">79%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-full max-w-8 items-center rounded-full">
                      <Image src="/images/country/country-02.svg" alt="france" width={32} height={32} />
                    </div>
                    <div>
                      <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">France</p>
                      <span className="block text-theme-xs text-gray-500 dark:text-gray-400">589 Customers</span>
                    </div>
                  </div>
                  <div className="flex w-full max-w-[140px] items-center gap-3">
                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                      <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white"></div>
                    </div>
                    <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">23%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-6">
            {/* Table One (Recent Orders) */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mt-6">
              <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Orders</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                    <svg className="stroke-current fill-white dark:fill-gray-800" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"/><path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"/></svg>
                    Filter
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">See all</button>
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-gray-100 border-y dark:border-gray-800">
                      <th className="py-3"><div className="flex items-center"><p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Products</p></div></th>
                      <th className="py-3"><div className="flex items-center"><p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</p></div></th>
                      <th className="py-3"><div className="flex items-center"><p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</p></div></th>
                      <th className="py-3"><div className="flex items-center col-span-2"><p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p></div></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                              <Image src="/images/product/product-01.jpg" alt="Product" width={50} height={50} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">Macbook pro 13”</p>
                              <span className="text-gray-500 text-theme-xs dark:text-gray-400">2 Variants</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">Laptop</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">$2399.00</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="rounded-full bg-green-50 px-2 py-0.5 text-theme-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">Delivered</p></div></td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                              <Image src="/images/product/product-02.jpg" alt="Product" width={50} height={50} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">Apple Watch Ultra</p>
                              <span className="text-gray-500 text-theme-xs dark:text-gray-400">1 Variants</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">Watch</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">$879.00</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="rounded-full bg-yellow-50 px-2 py-0.5 text-theme-xs font-medium text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400">Pending</p></div></td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="flex items-center gap-3">
                            <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                              <Image src="/images/product/product-03.jpg" alt="Product" width={50} height={50} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">iPhone 15 Pro Max</p>
                              <span className="text-gray-500 text-theme-xs dark:text-gray-400">2 Variants</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">SmartPhone</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="text-gray-500 text-theme-sm dark:text-gray-400">$1869.00</p></div></td>
                      <td className="py-3"><div className="flex items-center"><p className="rounded-full bg-green-50 px-2 py-0.5 text-theme-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">Delivered</p></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 