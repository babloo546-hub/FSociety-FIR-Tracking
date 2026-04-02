import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, FileText, Shield, BarChart3, LogOut, Bell } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getLinks = () => {
        if (!user) return [];
        if (user.role === 'CITIZEN') {
            return [
                { name: 'Dashboard', to: '/citizen/dashboard', icon: Home },
                { name: 'File FIR', to: '/citizen/new-fir', icon: FileText },
            ];
        }
        if (user.role === 'POLICE') {
            return [
                { name: 'Cases', to: '/police/dashboard', icon: Shield },
            ];
        }
        if (user.role === 'ADMIN') {
            return [
                { name: 'Analytics', to: '/admin/dashboard', icon: BarChart3 },
                { name: 'All FIRs', to: '/admin/firs', icon: FileText },
            ];
        }
        return [];
    };

    return (
        <div className="w-64 min-h-screen bg-[#0f172a] text-white flex flex-col relative z-20 shadow-2xl border-r border-[#1e293b]">
            <div className="p-6 border-b border-[#1e293b]">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white"/>
                    </div>
                    <span className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                        FIR Portal
                    </span>
                </div>
            </div>
            <div className="flex-1 px-3 py-6 space-y-1">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
                {getLinks().map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-[#1e293b] hover:text-gray-100'
                            }`
                        }
                    >
                        <link.icon className={`w-5 h-5 mr-3 transition-colors ${link.isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`} />
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </div>
            <div className="p-4 border-t border-[#1e293b]">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Secure Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
