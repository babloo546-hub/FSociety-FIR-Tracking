import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Search, UserPlus } from 'lucide-react';

const AllFIRs = () => {
    const [firs, setFirs] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [firsRes, officersRes] = await Promise.all([
                    api.get('fir-cases/firs/'),
                    api.get('auth/officers/')
                ]);
                setFirs(firsRes.data);
                setOfficers(officersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialData();
    }, []);

    const handleAssignOfficer = async (caseId, officerId) => {
        if (!officerId) return;
        try {
            await api.patch(`fir-cases/cases/${caseId}/assign_officer/`, { officer_id: officerId });
            // Refresh FIRs slightly to update the case details
            const res = await api.get('fir-cases/firs/');
            setFirs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (firId, newStatus) => {
        try {
            await api.patch(`fir-cases/firs/${firId}/update_status/`, { status: newStatus });
            const res = await api.get('fir-cases/firs/');
            setFirs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredFirs = firs.filter(fir => 
        fir.fir_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        fir.incident_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">All FIRs Management</h1>
                    <p className="text-slate-400 mt-1">Review cases, update statuses, and assign commanding officers.</p>
                </div>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Type..." 
                        className="official-input pl-10 w-72"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="official-table-wrapper">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0f172a]/90 border-b border-[#334155] text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <tr>
                            <th className="p-5">FIR ID</th>
                            <th className="p-5">Citizen</th>
                            <th className="p-5">Type</th>
                            <th className="p-5">Status</th>
                            <th className="p-5">Case & Assignment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/50">
                        {filteredFirs.map(fir => (
                            <tr key={fir.id} className="hover:bg-[#334155]/30 transition">
                                <td className="p-4 font-medium text-slate-100">{fir.fir_id}</td>
                                <td className="p-4 text-slate-300">{fir.citizen_name}</td>
                                <td className="p-4 text-slate-300">{fir.incident_type}</td>
                                <td className="p-4">
                                    <select 
                                        value={fir.status}
                                        onChange={(e) => handleStatusUpdate(fir.id, e.target.value)}
                                        className={`border rounded px-2 py-1 text-sm font-semibold outline-none ${
                                            fir.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50' : 
                                            fir.status === 'REJECTED' ? 'text-red-400 bg-red-900/30 border-red-800/50' : 'text-amber-400 bg-amber-900/30 border-amber-800/50'
                                        }`}
                                    >
                                        <option value="PENDING" className="bg-slate-900">Pending</option>
                                        <option value="APPROVED" className="bg-slate-900">Approve/File Case</option>
                                        <option value="REJECTED" className="bg-slate-900">Reject</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    {fir.case_details ? (
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm text-blue-300 bg-blue-900/40 border border-blue-800/50 px-2 py-1 rounded shadow-sm">Case #{fir.case_details.id}</span>
                                            <div className="flex items-center border border-[#334155] rounded overflow-hidden shadow-sm">
                                                <div className="px-2 bg-[#0f172a] border-r border-[#334155] text-slate-400 py-1.5"><UserPlus className="w-4 h-4"/></div>
                                                <select
                                                    value={fir.case_details.assigned_officer_details?.id || ""}
                                                    onChange={(e) => handleAssignOfficer(fir.case_details.id, e.target.value)}
                                                    className="px-2 py-1 text-sm bg-[#1e293b] text-slate-200 border-none outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-slate-900">Unassigned</option>
                                                    {officers.map(off => (
                                                        <option key={off.id} value={off.id} className="bg-slate-900">{off.username}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">Needs Approval</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllFIRs;
