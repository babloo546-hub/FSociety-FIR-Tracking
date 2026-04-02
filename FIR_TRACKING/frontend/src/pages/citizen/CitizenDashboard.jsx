import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

const CitizenDashboard = () => {
    const [firs, setFirs] = useState([]);

    useEffect(() => {
        const fetchFIRs = async () => {
            try {
                const res = await api.get('fir-cases/firs/');
                setFirs(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFIRs();
    }, []);

    const getStatusIcon = (status) => {
        if (status === 'PENDING') return <Clock className="w-5 h-5 text-yellow-500" />;
        if (status === 'APPROVED') return <CheckCircle className="w-5 h-5 text-green-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Your FIRs</h1>
                    <p className="text-slate-400 mt-1">Track the tactical history and status of your filed reports.</p>
                </div>
                <Link to="/citizen/new-fir" className="official-btn-amber flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> File New FIR
                </Link>
            </div>
            
            <div className="official-table-wrapper">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0f172a]/90 border-b border-[#334155] text-xs font-bold text-slate-300 uppercase tracking-widest">
                        <tr>
                            <th className="p-4">FIR ID</th>
                            <th className="p-4">Incident Type</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/50">
                        {firs.map((fir) => (
                            <tr key={fir.id} className="hover:bg-[#334155]/30 transition">
                                <td className="p-4 font-medium text-slate-100">{fir.fir_id}</td>
                                <td className="p-4 text-slate-300">{fir.incident_type}</td>
                                <td className="p-4 text-slate-300">{new Date(fir.incident_date).toLocaleDateString()}</td>
                                <td className="p-4 flex items-center space-x-2">
                                    {getStatusIcon(fir.status)}
                                    <span className="font-medium text-sm text-slate-200">{fir.status}</span>
                                </td>
                                <td className="p-4">
                                    <Link to={`/citizen/track/${fir.id}`} className="text-blue-400 hover:text-blue-300 font-medium text-sm drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                                        Scan Timeline
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {firs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    No FIRs filed yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitizenDashboard;
