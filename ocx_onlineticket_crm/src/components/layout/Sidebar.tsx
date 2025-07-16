"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.10322 0.956299H2.53135C1.3781 0.956299 0.4375 1.897 0.4375 3.05025V6.62212C0.4375 7.77537 1.3781 8.71607 2.53135 8.71607H6.10322C7.25647 8.71607 8.19717 7.77537 8.19717 6.62212V3.05025C8.19717 1.897 7.25647 0.956299 6.10322 0.956299Z" fill=""/>
          <path d="M15.4689 0.956299H11.8971C10.7438 0.956299 9.80322 1.897 9.80322 3.05025V6.62212C9.80322 7.77537 10.7438 8.71607 11.8971 8.71607H15.4689C16.6222 8.71607 17.5629 7.77537 17.5629 6.62212V3.05025C17.5629 1.897 16.6222 0.956299 15.4689 0.956299Z" fill=""/>
          <path d="M6.10322 9.28369H2.53135C1.3781 9.28369 0.4375 10.2244 0.4375 11.3776V14.9495C0.4375 16.1028 1.3781 17.0435 2.53135 17.0435H6.10322C7.25647 17.0435 8.19717 16.1028 8.19717 14.9495V11.3776C8.19717 10.2244 7.25647 9.28369 6.10322 9.28369Z" fill=""/>
          <path d="M15.4689 9.28369H11.8971C10.7438 9.28369 9.80322 10.2244 9.80322 11.3776V14.9495C9.80322 16.1028 10.7438 17.0435 11.8971 17.0435H15.4689C16.6222 17.0435 17.5629 16.1028 17.5629 14.9495V11.3776C17.5629 10.2244 16.6222 9.28369 15.4689 9.28369Z" fill=""/>
        </svg>
      ),
      href: '/dashboard'
    },
    {
      id: 'organizations',
      title: 'Organizations',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM9 10.5c-2.34 0-7 1.175-7 3.5V16.5h14v-2.5c0-2.325-4.66-3.5-7-3.5z" fill=""/>
        </svg>
      ),
      href: '/organizations'
    },
    {
      id: 'users',
      title: 'Users',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM9 10.5c-2.34 0-7 1.175-7 3.5V16.5h14v-2.5c0-2.325-4.66-3.5-7-3.5z" fill=""/>
        </svg>
      ),
      href: '/users'
    },
    {
      id: 'events',
      title: 'Events',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.75 2.25V3.75H11.25V2.25C11.25 1.83579 11.5858 1.5 12 1.5C12.4142 1.5 12.75 1.83579 12.75 2.25V3.75H13.5C14.7426 3.75 15.75 4.75736 15.75 6V15C15.75 16.2426 14.7426 17.25 13.5 17.25H4.5C3.25736 17.25 2.25 16.2426 2.25 15V6C2.25 4.75736 3.25736 3.75 4.5 3.75H5.25V2.25C5.25 1.83579 5.58579 1.5 6 1.5C6.41421 1.5 6.75 1.83579 6.75 2.25ZM6.75 5.25H4.5C4.08579 5.25 3.75 5.58579 3.75 6V15C3.75 15.4142 4.08579 15.75 4.5 15.75H13.5C13.9142 15.75 14.25 15.4142 14.25 15V6C14.25 5.58579 13.9142 5.25 13.5 5.25H11.25V6.75C11.25 7.16421 10.9142 7.5 10.5 7.5C10.0858 7.5 9.75 7.16421 9.75 6.75V5.25H8.25V6.75C8.25 7.16421 7.91421 7.5 7.5 7.5C7.08579 7.5 6.75 7.16421 6.75 6.75V5.25Z" fill=""/>
        </svg>
      ),
      href: '/events'
    },
    {
      id: 'tickets',
      title: 'Tickets',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.75 6.75V4.5C15.75 3.67157 15.0784 3 14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V6.75M15.75 6.75V15C15.75 15.8284 15.0784 16.5 14.25 16.5H3.75C2.92157 16.5 2.25 15.8284 2.25 15V6.75M15.75 6.75H2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: '/tickets'
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.25c.621 0 1.125-.504 1.125-1.125V5.375c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.25 3 4.754 3 5.375v7.875C3 13.746 3.504 14.25 4.125 14.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: '/orders'
    },
    {
      id: 'checkin',
      title: 'Check-in',
      icon: (
        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12.75L12.75 9L9 5.25M5.25 9H12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      href: '/checkin'
    }
  ];

  return (
    <aside className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/dashboard">
          <Image
            width={176}
            height={32}
            src="/images/logo/logo.svg"
            alt="Logo"
            priority
          />
        </Link>

        <button
          aria-controls="sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.21248 17.625 9.36248 17.4375C9.69998 17.1 9.69998 16.575 9.36248 16.2375L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* SIDEBAR HEADER */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* Menu Group */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      activeMenu === item.id && 'bg-graydark dark:bg-meta-4'
                    }`}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 