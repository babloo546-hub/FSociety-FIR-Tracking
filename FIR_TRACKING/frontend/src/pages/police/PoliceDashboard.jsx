import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

const PoliceDashboard = () => {
    const [cases, setCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await api.get('fir-cases/cases/');
                setCases(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCases();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.patch(`fir-cases/cases/${id}/`, { status: newStatus });
            setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-100">Assigned Tactical Cases</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map(c => (
                    <div key={c.id} className="official-card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">Case #{c.id}</h3>
                                    <p className="text-sm text-slate-400">FIR Reference: {c.fir?.fir_id}</p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded font-bold uppercase tracking-widest border ${
                                    c.status === 'INVESTIGATION' ? 'bg-indigo-900/50 text-indigo-400 border-indigo-700/50 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                                    c.status === 'CLOSED' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    'bg-amber-900/50 text-amber-500 border-amber-700/50 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                }`}>
                                    {c.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 mb-4 line-clamp-3">
                                <span className="font-semibold text-slate-200">Incident Details:</span> {c.fir?.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-[#334155]/60">
                                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Command Action</label>
                                <select 
                                    value={c.status}
                                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                    className="w-full bg-[#0f172a] border border-[#334155] text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-transparent p-2.5 outline-none font-medium"
                                >
                                    <option value="FILED">FILED</option>
                                    <option value="INVESTIGATION">UNDER INVESTIGATION</option>
                                    <option value="EVIDENCE">EVIDENCE COLLECTION</option>
                                    <option value="COURT">ACTIVE COURT DISCOVERY</option>
                                    <option value="CLOSED">CASE CLOSED</option>
                                </select>
                            </div>
                            <button onClick={() => window.location.href=`/police/case/${c.id}`} className="mt-5 w-full flex items-center justify-center py-2.5 text-sm text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-900/50 rounded-lg transition-all font-bold tracking-wide">
                                Access Secure Files <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {cases.length === 0 && (
                <div className="text-center py-12 official-card flex flex-col items-center justify-center">
                    <ShieldAlert className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-300 tracking-wide">Secure Channel Empty</h3>
                    <p className="text-slate-500 mt-2">There are currently no active case assignments for your clearance level.</p>
                </div>
            )}
        </div>
    );
};

export default PoliceDashboard;
