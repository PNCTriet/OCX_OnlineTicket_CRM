"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Khi load trang, đọc trạng thái darkMode từ localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) {
        setDarkMode(JSON.parse(stored));
      }
    }
  }, []);

  // Mỗi khi darkMode thay đổi, cập nhật class và localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen dark:bg-gray-900 sm:p-0 lg:flex-row">
        {/* Form */}
        <div className="flex flex-col flex-1 w-full lg:w-1/2">
          <div className="w-full max-w-md pt-5 mx-auto sm:py-10">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg className="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2">Back to dashboard</span>
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign Up</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign up!</p>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                  <button type="button" className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                    {/* Google icon */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4" />
                      <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853" />
                      <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05" />
                      <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335" />
                    </svg>
                    Sign up with Google
                  </button>
                  <button type="button" className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                    {/* X icon */}
                    <svg width="21" className="fill-current" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                    </svg>
                    Sign up with X
                  </button>
                </div>
                <div className="relative py-3 sm:py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Or</span>
                  </div>
                </div>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="sm:col-span-1">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        First Name<span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fname"
                        name="fname"
                        placeholder="Enter your first name"
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                      />
                    </div>
                    {/* Last Name */}
                    <div className="sm:col-span-1">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Last Name<span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lname"
                        name="lname"
                        placeholder="Enter your last name"
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email<span className="text-error-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                    />
                  </div>
                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password<span className="text-error-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                      />
                      <span
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                        {showPassword ? (
                          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.638 3.577a1 1 0 0 0-1.06 1.06l1.276 1.276C3.746 6.842 2.894 8.064 2.416 9.459a1 1 0 0 0 0 .487c1.08 3.15 4.067 5.417 7.585 5.417 1.255 0 2.442-.288 3.5-.802l1.863 1.863a1 1 0 0 0 1.414-1.414L4.638 3.577ZM12.36 13.421l-1.914-1.913a1.5 1.5 0 0 1-.441.053h-.015c-1.026 0-1.858-.832-1.858-1.858 0-.156.02-.308.056-.453l-2.27-2.27c-.884.711-1.578 1.648-1.995 2.723 1.08 2.435 3.445 4.16 6.212 4.16.833 0 1.629-.156 2.361-.441ZM16.077 9.702c-.293.755-.722 1.441-1.257 2.029l1.062 1.062c.752-.811 1.338-1.778 1.704-2.847a1 1 0 0 0 0-.487c-1.08-3.15-4.067-5.417-7.585-5.417-.865 0-1.698.137-2.478.39l1.229 1.229c.404-.079.822-.12 1.249-.12 2.767 0 5.133 1.725 6.078 4.16Z" fill="#98A2B3" />
                          </svg>
                        ) : (
                          <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Checkbox */}
                  <div>
                    <label htmlFor="checkboxLabelOne" className="flex items-start text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="checkboxLabelOne"
                          className="sr-only"
                          checked={agreeTerms}
                          onChange={() => setAgreeTerms((v) => !v)}
                        />
                        <div className={`mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] ${agreeTerms ? 'border-blue-500 bg-blue-500' : 'bg-transparent border-gray-300 dark:border-gray-700'}`}>
                          <span className={agreeTerms ? '' : 'opacity-0'}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" strokeWidth="1.94437" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                        By creating an account means you agree to the
                        <span className="text-gray-800 dark:text-white/90"> Terms and Conditions,</span>
                        and our
                        <span className="text-gray-800 dark:text-white"> Privacy Policy</span>
                      </p>
                    </label>
                  </div>
                  {/* Button */}
                  <div>
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-600 shadow hover:bg-blue-700">
                      Sign Up
                    </button>
                  </div>
                </form>
                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-blue-500 hover:text-blue-600 dark:text-blue-400">Sign In</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Banner/Logo side */}
        <div className="relative items-center hidden w-full h-full bg-blue-950 dark:bg-white/5 lg:grid lg:w-1/2">
          <div className="flex items-center justify-center z-1">
            {/* Grid shape, logo, description */}
            <div className="flex flex-col items-center max-w-xs">
              <Link href="/" className="block mb-4">
                <Image src="/images/logo/auth-logo.svg" alt="Logo" width={170} height={80} />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div>
          </div>
        </div>
        {/* Dark mode toggler (floating) */}
        <button
          className="fixed z-50 hidden bottom-6 right-6 sm:block flex items-center justify-center text-white transition-colors rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600"
          onClick={() => setDarkMode((v) => !v)}
        >
          {darkMode ? (
            <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 1.54c.41 0 .75.34.75.75v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V2.29c0-.41.34-.75.75-.75Zm.001 5.25A3.21 3.21 0 0 0 6.79 10c0 1.77 1.44 3.21 3.21 3.21 1.77 0 3.21-1.44 3.21-3.21 0-1.77-1.44-3.21-3.21-3.21ZM5.29 10c0-2.6 2.11-4.71 4.71-4.71 2.6 0 4.71 2.11 4.71 4.71 0 2.6-2.11 4.71-4.71 4.71-2.6 0-4.71-2.11-4.71-4.71Zm10.69-4.92a.75.75 0 0 1 1.06 0c.29.29.29.76 0 1.06l-.88.88a.75.75 0 1 1-1.06-1.06l.88-.88ZM18.46 10c0 .41-.34.75-.75.75h-1.25a.75.75 0 0 1 0-1.5h1.25c.41 0 .75.34.75.75Zm-3.54 5.98a.75.75 0 0 1 0 1.06c-.29.29-.76.29-1.06 0l-.88-.88a.75.75 0 1 1 1.06-1.06l.88.88ZM10 15.71c.41 0 .75.34.75.75v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-1.25c0-.41.34-.75.75-.75Zm-4.04-.61a.75.75 0 0 1-1.06 0c-.29-.29-.29-.76 0-1.06l.88-.88a.75.75 0 1 1 1.06 1.06l-.88.88ZM3.54 10c0 .41.34.75.75.75h1.25a.75.75 0 0 0 0-1.5H4.29a.75.75 0 0 0-.75.75Zm1.06-4.92a.75.75 0 0 1 0-1.06c.29-.29.76-.29 1.06 0l.88.88a.75.75 0 1 1-1.06 1.06l-.88-.88Z" fill="currentColor" />
            </svg>
          ) : (
            <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.45 11.97l.73.19c.09-.32-.05-.66-.29-.83-.29-.17-.65-.13-.89.1l.45.54ZM8.03 2.55l.55.51c.23-.24.27-.6.1-.88-.17-.29-.51-.43-.83-.35l.18.72ZM12.92 13c-3.27 0-5.92-2.65-5.92-5.92h-1.5c0 4.1 3.32 7.42 7.42 7.42V13Zm4.03-1.58c-1.06.98-2.48 1.58-4.03 1.58v1.5c1.95 0 3.72-.75 5.05-1.98l-1.02-1.1Zm-.21.36c-.79 2.98-3.5 5.18-6.73 5.18v1.5c3.93 0 7.23-2.67 8.18-6.29l-1.45-.39ZM10 16.96c-3.84 0-7-3.12-7-6.96H1.54c0 4.67 3.79 8.46 8.46 8.46v-1.5Zm-3-9.87c0-1.56.6-3.33 1.58-4.3l-1.1-1.02C6.25 3.36 5.5 5.13 5.5 7.08h1.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
} 