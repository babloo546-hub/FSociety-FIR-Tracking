import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, UserCircle } from 'lucide-react';

const Topbar = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#1e293b] flex items-center justify-between px-8 shadow-sm">
            <div className="text-slate-400 font-medium">
                Welcome back, <span className="text-white font-bold tracking-wide">{user?.username}</span>
            </div>
            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-full hover:bg-slate-800">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0f172a]"></span>
                </button>
                <div className="flex items-center space-x-3 pl-6 border-l border-[#1e293b]">
                    <div className="w-10 h-10 bg-blue-900/50 border border-blue-800/50 rounded-full flex items-center justify-center text-blue-400">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-300 tracking-wider bg-[#1e293b] border border-[#334155] px-3 py-1 rounded-full">{user?.role}</span>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
