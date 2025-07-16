"use client";
import React, { useState, createContext, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Context to provide sidebar state to children (for responsive content shift)
export const SidebarContext = createContext<{sidebarOpen: boolean, setSidebarOpen: (open: boolean) => void}>({sidebarOpen: false, setSidebarOpen: () => {}});

const SIDEBAR_WIDTH = 288; // w-72 = 288px
const SIDEBAR_COLLAPSED = 80; // w-20 = 80px

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED;

    return (
        <SidebarContext.Provider value={{sidebarOpen, setSidebarOpen}}>
            <div className="dark:bg-boxdark-2 flex h-screen w-screen overflow-hidden">
                {/* Sidebar - always on the left, full height */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* Content Area - margin left = sidebar width */}
                <div
                    className="flex flex-1 flex-col min-w-0 min-h-0"
                    style={{ marginLeft: sidebarWidth }}
                >
                    {/* Header */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* Scrollable Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
};

export default DashboardLayout; 