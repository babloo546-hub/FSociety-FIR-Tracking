import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FileUp, CalendarPlus, ArrowLeft } from 'lucide-react';

const CaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState(null);
    const [evidenceDesc, setEvidenceDesc] = useState('');
    const [evidenceFile, setEvidenceFile] = useState(null);
    const [courtDate, setCourtDate] = useState('');
    const [courtNotes, setCourtNotes] = useState('');

    useEffect(() => {
        fetchCase();
    }, [id]);

    const fetchCase = async () => {
        try {
            const res = await api.get(`fir-cases/cases/${id}/`);
            setCaseData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEvidenceUpload = async (e) => {
        e.preventDefault();
        if (!evidenceFile) return;
        
        const formData = new FormData();
        formData.append('associated_case', id);
        formData.append('description', evidenceDesc);
        formData.append('file', evidenceFile);

        try {
            await api.post('fir-cases/evidence/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEvidenceDesc('');
            setEvidenceFile(null);
            fetchCase();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCourtDateAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('fir-cases/court-dates/', {
                associated_case: id,
                hearing_date: courtDate,
                notes: courtNotes
            });
            setCourtDate('');
            setCourtNotes('');
            fetchCase();
        } catch (err) {
            console.error(err);
        }
    };

    if (!caseData) return <div className="p-8">Loading case details...</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition group focus:outline-none">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"/> <span className="font-semibold tracking-wide">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-100 uppercase tracking-widest drop-shadow-md">Secure Case #{caseData.id}</h1>
            <p className="text-slate-400 mb-6 font-medium tracking-wide">FIR Reference ID: {caseData.fir?.fir_id}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Evidence Section */}
                <div className="official-card">
                    <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center border-b border-[#334155]/60 pb-3">
                        <FileUp className="w-6 h-6 mr-2 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]"/> Evidence Uplink
                    </h2>
                    <form onSubmit={handleEvidenceUpload} className="space-y-5 mb-6 pb-6 border-b border-[#334155]/60">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                            <input type="text" required value={evidenceDesc} onChange={e => setEvidenceDesc(e.target.value)} className="official-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Secure Attachment</label>
                            <input type="file" required onChange={e => setEvidenceFile(e.target.files[0])} className="w-full mt-1 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#1e293b] file:text-blue-400 hover:file:bg-[#334155] file:transition-colors text-slate-300" />
                        </div>
                        <button type="submit" className="w-full official-btn-primary py-3">Transmit Evidence</button>
                    </form>
                    
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Logged Evidence Files</h3>
                    <ul className="space-y-3">
                        {caseData.evidence?.map(e => (
                            <li key={e.id} className="bg-[#0f172a]/60 p-3 rounded-lg border border-[#334155]/50 flex justify-between items-center text-sm shadow-inner">
                                <div>
                                    <p className="font-bold text-slate-300">{e.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">Agent {e.uploaded_by_name} | {new Date(e.uploaded_at).toLocaleString()}</p>
                                </div>
                                <a href={e.file} target="_blank" rel="noreferrer" className="text-blue-400 font-bold hover:text-blue-300 transition-colors uppercase tracking-wide text-xs border border-blue-500/30 px-3 py-1.5 rounded bg-blue-900/20 hover:bg-blue-900/40">Access</a>
                            </li>
                        ))}
                        {!caseData.evidence?.length && <p className="text-sm text-slate-500 italic block py-4 text-center">No tactical evidence files uploaded.</p>}
                    </ul>
                </div>

                {/* Court Dates Section */}
                <div className="official-card">
                    <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center border-b border-[#334155]/60 pb-3">
                        <CalendarPlus className="w-6 h-6 mr-2 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"/> Court Schedule
                    </h2>
                    <form onSubmit={handleCourtDateAdd} className="space-y-5 mb-6 pb-6 border-b border-[#334155]/60">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Hearing Date & Time</label>
                            <input type="datetime-local" required value={courtDate} onChange={e => setCourtDate(e.target.value)} className="official-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Advisory Notes (Optional)</label>
                            <input type="text" value={courtNotes} onChange={e => setCourtNotes(e.target.value)} className="official-input" />
                        </div>
                        <button type="submit" className="w-full official-btn-amber py-3">Schedule Briefing</button>
                    </form>

                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Schedules</h3>
                    <ul className="space-y-3">
                        {caseData.court_dates?.map(d => (
                            <li key={d.id} className="bg-amber-900/10 p-4 rounded-lg border border-amber-900/30 text-sm shadow-inner relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-lg shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                                <p className="font-bold text-amber-400 pl-2 text-base tracking-wide">{new Date(d.hearing_date).toLocaleString()}</p>
                                {d.notes && <p className="text-slate-300 mt-2 pl-2 border-t border-amber-900/30 pt-2 font-medium">{d.notes}</p>}
                            </li>
                        ))}
                         {!caseData.court_dates?.length && <p className="text-sm text-slate-500 italic block py-4 text-center">No active court sessions logged.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;
