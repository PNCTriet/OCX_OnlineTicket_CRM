"use client";
import React from "react";

export default function TestFlightBuyTicketPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Test Flight - Buy Ticket
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Đây là trang public không cần authentication để test middleware.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              ✅ Public Page
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Trang này không bị middleware bảo vệ và có thể truy cập mà không cần đăng nhập.
            </p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              🔗 Test Links
            </h3>
            <div className="space-y-2 text-sm">
              <a 
                href="/dashboard" 
                className="block text-blue-700 dark:text-blue-300 hover:underline"
              >
                /dashboard (Protected - sẽ redirect về signin)
              </a>
              <a 
                href="/users" 
                className="block text-blue-700 dark:text-blue-300 hover:underline"
              >
                /users (Protected - sẽ redirect về signin)
              </a>
              <a 
                href="/signin" 
                className="block text-blue-700 dark:text-blue-300 hover:underline"
              >
                /signin (Public)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 