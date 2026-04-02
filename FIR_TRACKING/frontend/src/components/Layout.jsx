import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#0b1120] relative selection:bg-blue-500/30 selection:text-blue-200">
            {/* Tactical Glow Mesh */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none z-0"></div>
            <div className="absolute top-1/4 right-0 w-1/3 h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
            
            <Sidebar />
            <div className="flex-1 flex flex-col relative z-10 w-full">
                <Topbar />
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
