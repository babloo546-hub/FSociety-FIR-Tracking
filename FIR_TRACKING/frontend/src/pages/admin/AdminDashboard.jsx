import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Clock, Briefcase, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('analytics/summary/');
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalytics();
    }, []);

    if (!analytics) return <div>Loading Analytics...</div>;

    const stats = {
        totalFirs: analytics.total_firs,
        pendingFirs: analytics.pending_firs,
        activeCases: analytics.under_investigation,
        totalOfficers: analytics.total_officers
    };

    // Format chart data
    const chartData = analytics.monthly_trends.map(t => ({
        name: `Month ${t.created_at__month}`,
        FIRs: t.total
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">System Global Overview</h1>
            {/* The cards are already rendered... */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="official-card bg-gradient-to-br from-[#1e3a8a]/40 to-transparent border-blue-900/50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-900/50 rounded-lg text-blue-400 border border-blue-700/50"><FileText /></div>
                        <h3 className="text-slate-400 font-medium">Total FIRs</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-100">{stats.totalFirs}</p>
                </div>
                <div className="official-card bg-gradient-to-br from-amber-900/40 to-transparent border-amber-900/50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-amber-900/50 rounded-lg text-amber-500 border border-amber-700/50"><Clock /></div>
                        <h3 className="text-slate-400 font-medium">Pending/Alert</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-100 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">{stats.pendingFirs}</p>
                </div>
                <div className="official-card bg-gradient-to-br from-indigo-900/40 to-transparent border-indigo-900/50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-indigo-900/50 rounded-lg text-indigo-400 border border-indigo-700/50"><Briefcase /></div>
                        <h3 className="text-slate-400 font-medium">Active Cases</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-100">{stats.activeCases}</p>
                </div>
                <div className="official-card bg-gradient-to-br from-emerald-900/40 to-transparent border-emerald-900/50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-emerald-900/50 rounded-lg text-emerald-400 border border-emerald-700/50"><Users /></div>
                        <h3 className="text-slate-400 font-medium">Officers Active</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-100">{stats.totalOfficers}</p>
                </div>
            </div>

            <div className="official-card">
                <h2 className="text-xl font-bold text-slate-100 mb-6">FIRs Filed (Last 6 Months)</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                            <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                            <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#f1f5f9'}} />
                            <Bar dataKey="FIRs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
