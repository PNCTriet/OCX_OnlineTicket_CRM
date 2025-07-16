"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!sidebarOpen && '!w-full delay-300'}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && '!w-full delay-400'}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!sidebarOpen && '!w-full delay-500'}`}></span>
              </span>
            </span>
          </button>
          {/* Hamburger Toggle BTN */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src="/images/logo/logo-icon.svg"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li className="hidden sm:block">
              <button
                onClick={() => {
                  const html = document.querySelector('html');
                  if (html) {
                    html.classList.toggle('dark');
                  }
                }}
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M6 10.6C6 6.29848 9.29848 3 13.6 3C17.9015 3 21.2 6.29848 21.2 10.6C21.2 14.9015 17.9015 18.2 13.6 18.2C9.29848 18.2 6 14.9015 6 10.6Z"
                      fill=""
                    />
                    <g>
                      <ul>
                        <li>
                          <a href="#">
                            <svg
                              className="fill-current"
                              width="22"
                              height="22"
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M21 10H3M21 10L12 1M21 10L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
                        </li>
                      </ul>
                    </g>
                  </g>
                </svg>
              </button>
            </li>
          </ul>

          {/* User Area */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  Admin User
                </span>
                <span className="block text-xs">Admin</span>
              </span>

              <span className="h-12 w-12 rounded-full">
                <Image
                  width={112}
                  height={112}
                  className="rounded-full"
                  src="/images/user/user-01.jpg"
                  alt="User"
                />
              </span>

              <svg
                className={`fill-current duration-300 ease-in-out ${dropdownOpen ? 'rotate-180' : ''}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
                  fill=""
                />
              </svg>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
                dropdownOpen === true ? 'block' : 'hidden'
              }`}
            >
              <ul className="flex flex-col gap-2 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 9.62499C8.09375 9.62499 5.75 7.28124 5.75 4.37499C5.75 1.46874 8.09375 -0.875 11 -0.875C13.9062 -0.875 16.25 1.46874 16.25 4.37499C16.25 7.28124 13.9062 9.62499 11 9.62499ZM11 1.62499C8.96875 1.62499 7.25 3.34374 7.25 5.37499C7.25 7.40624 8.96875 9.12499 11 9.12499C13.0312 9.12499 14.75 7.40624 14.75 5.37499C14.75 3.34374 13.0312 1.62499 11 1.62499Z"
                        fill=""
                      />
                      <path
                        d="M17.4062 21.87C17.0062 21.87 16.6406 21.73 16.3594 21.48C15.7344 20.95 14.7812 20.87 14.0781 21.39C13.125 22.09 11.4688 22.09 10.5156 21.39C9.8125 20.87 8.85938 20.95 8.23438 21.48C7.95313 21.73 7.5875 21.87 7.1875 21.87C6.5 21.87 5.9375 21.31 5.9375 20.62C5.9375 19.93 6.5 19.37 7.1875 19.37C7.5875 19.37 7.95313 19.51 8.23438 19.76C8.85938 20.29 9.8125 20.21 10.5156 19.69C11.4688 18.99 13.125 18.99 14.0781 19.69C14.7812 20.21 15.7344 20.29 16.3594 19.76C16.6406 19.51 17.0062 19.37 17.4062 19.37C18.0938 19.37 18.6562 19.93 18.6562 20.62C18.6562 21.31 18.0938 21.87 17.4062 21.87Z"
                        fill=""
                      />
                    </svg>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 10H3M21 10L12 1M21 10L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Settings
                  </Link>
                </li>
              </ul>
              <button className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.53437 10.7594 6.29062 11.6531 6.29062H15.5375C16.4313 6.29062 17.1875 5.53437 17.1875 4.64062V2.26874C17.1875 1.37499 16.4313 0.618744 15.5375 0.618744Z"
                    fill=""
                  />
                  <path
                    d="M6.39688 0.618744H2.51562C1.62188 0.618744 0.866667 1.37499 0.866667 2.26874V4.64062C0.866667 5.53437 1.62188 6.29062 2.51562 6.29062H6.39688C7.29063 6.29062 8.04688 5.53437 8.04688 4.64062V2.26874C8.04688 1.37499 7.29063 0.618744 6.39688 0.618744Z"
                    fill=""
                  />
                  <path
                    d="M15.5375 15.3813H11.6531C10.7594 15.3813 10.0031 16.1375 10.0031 17.0313V19.4031C10.0031 20.2969 10.7594 21.0531 11.6531 21.0531H15.5375C16.4313 21.0531 17.1875 20.2969 17.1875 19.4031V17.0313C17.1875 16.1375 16.4313 15.3813 15.5375 15.3813Z"
                    fill=""
                  />
                  <path
                    d="M6.39688 15.3813H2.51562C1.62188 15.3813 0.866667 16.1375 0.866667 17.0313V19.4031C0.866667 20.2969 1.62188 21.0531 2.51562 21.0531H6.39688C7.29063 21.0531 8.04688 20.2969 8.04688 19.4031V17.0313C8.04688 16.1375 7.29063 15.3813 6.39688 15.3813Z"
                    fill=""
                  />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 