"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/authApi";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export default function SignPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated]);

  // Khi load trang, đọc trạng thái darkMode từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) {
        setDarkMode(JSON.parse(stored));
      }
    }
  }, []);

  // Mỗi khi darkMode thay đổi, cập nhật class và localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(email, password);
      login(data); // Lưu vào context/localStorage
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // Frontend gọi Supabase Auth OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Supabase sẽ tự động redirect đến Google OAuth
      // Sau khi user authenticate, Google callback về Supabase
      // Supabase sẽ redirect về frontend callback page với JWT token
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0 h-screen overflow-hidden sm:overflow-auto">
      <div className="relative flex flex-col justify-center w-full h-screen dark:bg-gray-900 sm:p-0 lg:flex-row">
        {/* Form */}
        <div className="flex flex-col flex-1 w-full lg:w-1/2">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                  >
                    
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                        fill="#EB4335"
                      />
                    </svg>
                    {googleLoading ? "Signing in..." : "Sign in with Google"}
                  </button>
                </div> */}
                <div className="relative py-3 sm:py-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                  </div>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email<span className="text-error-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="info@gmail.com"
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Password<span className="text-error-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                      >
                        {showPassword ? (
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.638 3.577a1 1 0 0 0-1.06 1.06l1.276 1.276C3.746 6.842 2.894 8.064 2.416 9.459a1 1 0 0 0 0 .487c1.08 3.15 4.067 5.417 7.585 5.417 1.255 0 2.442-.288 3.5-.802l1.863 1.863a1 1 0 0 0 1.414-1.414L4.638 3.577ZM12.36 13.421l-1.914-1.913a1.5 1.5 0 0 1-.441.053h-.015c-1.026 0-1.858-.832-1.858-1.858 0-.156.02-.308.056-.453l-2.27-2.27c-.884.711-1.578 1.648-1.995 2.723 1.08 2.435 3.445 4.16 6.212 4.16.833 0 1.629-.156 2.361-.441ZM16.077 9.702c-.293.755-.722 1.441-1.257 2.029l1.062 1.062c.752-.811 1.338-1.778 1.704-2.847a1 1 0 0 0 0-.487c-1.08-3.15-4.067-5.417-7.585-5.417-.865 0-1.698.137-2.478.39l1.229 1.229c.404-.079.822-.12 1.249-.12 2.767 0 5.133 1.725 6.078 4.16Z"
                              fill="#98A2B3"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.41550 9.4593C2.36150 9.61687 2.36150 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.61690 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                              fill="#98A2B3"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Checkbox */}
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="checkboxLabelOne"
                      className="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="checkboxLabelOne"
                          className="sr-only"
                          checked={keepLoggedIn}
                          onChange={() => setKeepLoggedIn((v) => !v)}
                        />
                        <div
                          className={`mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] ${keepLoggedIn ? "border-blue-500 bg-blue-500" : "bg-transparent border-gray-300 dark:border-gray-700"}`}
                        >
                          <span className={keepLoggedIn ? "" : "opacity-0"}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                stroke="white"
                                strokeWidth="1.94437"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      Keep me logged in
                    </label>
                    <Link
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        alert("This feature is disabled by admin. Please contact support for assistance.");
                      }}
                      className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {/* Error message */}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {/* Button */}
                  <div>
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-blue-600 shadow hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </div>
                </form>
                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        alert("This feature is disabled by admin. Please contact support for assistance.");
                      }}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    >
                      Sign Up
                    </Link>
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
              <Link href="/" className="block mb-4"></Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Holws Ticket | Ớt Cay Xè Admin Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
