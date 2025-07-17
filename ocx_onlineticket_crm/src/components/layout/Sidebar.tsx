"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  IconLayoutDashboard,
  IconBuilding,
  IconUsers,
  IconCalendarEvent,
  IconTicket,
  IconShoppingCart,
  IconCheck,
} from '@tabler/icons-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuGroups = [
  {
    title: 'MENU',
    id: 'menu',
    items: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <IconLayoutDashboard className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/dashboard',
      },
      {
        id: 'organizations',
        title: 'Organizations',
        icon: <IconBuilding className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/organizations',
      },
      {
        id: 'users',
        title: 'Users',
        icon: <IconUsers className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/users',
      },
      {
        id: 'events',
        title: 'Events',
        icon: <IconCalendarEvent className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/events',
      },
    ],
  },
  {
    title: 'OTHERS',
    id: 'others',
    items: [
      {
        id: 'tickets',
        title: 'Tickets',
        icon: <IconTicket className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/tickets',
      },
      {
        id: 'orders',
        title: 'Orders',
        icon: <IconShoppingCart className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/orders',
      },
      {
        id: 'checkin',
        title: 'Check-in',
        icon: <IconCheck className="w-5 h-5 text-gray-700 dark:text-white" />,
        href: '/checkin',
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const isCollapsed = !sidebarOpen;

  return (
    <aside
      className={`fixed left-0 top-0 z-9999 flex h-screen flex-col overflow-y-hidden border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 duration-300 ease-linear
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* SIDEBAR HEADER */}
      <div className={`flex items-center gap-2 pt-8 pb-7 ${isCollapsed ? 'justify-center' : 'justify-between'} sidebar-header`}> 
        <Link href="/dashboard">
          {/* Logo full when expanded, icon when collapsed */}
          <span className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <Image
              width={176}
              height={32}
              src="/images/logo/logo.svg"
              alt="Logo"
              priority
              className="dark:hidden"
            />
            <Image
              width={176}
              height={32}
              src="/images/logo/logo-dark.svg"
              alt="Logo Dark"
              priority
              className="hidden dark:block"
            />
          </span>
          <span className={`${isCollapsed ? 'block' : 'hidden'}`}>
            <Image
              width={32}
              height={32}
              src="/images/logo/logo-icon.svg"
              alt="Logo Icon"
              priority
            />
          </span>
        </Link>
        {/* Hamburger only when expanded */}
        {!isCollapsed && (
          <button
            aria-controls="sidebar"
            onClick={() => setSidebarOpen(false)}
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
        )}
      </div>
      {/* SIDEBAR HEADER */}

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        {/* Sidebar Menu */}
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-6">
            {/* Group Title */}
            <h3 className={`mb-4 ml-2 text-xs uppercase leading-[20px] text-gray-400 transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0 h-0 overflow-hidden' : 'opacity-100 w-auto h-auto'}`}>
              {group.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-3 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-white/[0.03] ${activeMenu === item.id && 'bg-gray-100 dark:bg-white/[0.03]'} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className={`transition-all duration-200 text-gray-700 dark:text-white ${isCollapsed ? 'opacity-0 w-0 h-0 overflow-hidden' : 'opacity-100 w-auto h-auto'}`}>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar; 