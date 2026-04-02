import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { CheckCircle2, Circle, Clock, ArrowLeft } from 'lucide-react';

const steps = [
    { id: 'PENDING', label: 'FIR Filed' },
    { id: 'FILED', label: 'Case Assigned' },
    { id: 'INVESTIGATION', label: 'Under Investigation' },
    { id: 'EVIDENCE', label: 'Evidence Collection' },
    { id: 'COURT', label: 'In Court' },
    { id: 'CLOSED', label: 'Case Closed' },
];

const CaseTrack = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fir, setFir] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`fir-cases/firs/${id}/`);
                setFir(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetails();
    }, [id]);

    if (!fir) return <div className="p-8">Loading case track...</div>;

    // Determine current step index
    // If FIR is pending/rejected, it doesn't have a case status yet.
    let currentStepIndex = 0;
    if (fir.status === 'REJECTED') {
        currentStepIndex = -1; // Special rejected state
    } else if (fir.case_details) {
        currentStepIndex = steps.findIndex(s => s.id === fir.case_details.status);
        if (currentStepIndex === -1) currentStepIndex = 1; // Fallback to FILED if unknown
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition group focus:outline-none">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"/> <span className="font-semibold tracking-wide">Back to Dashboard</span>
            </button>
            <div className="official-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <h1 className="text-2xl font-bold text-slate-100 mb-2 uppercase tracking-widest drop-shadow-md">Tracking FIR: {fir.fir_id}</h1>
                <p className="text-slate-400 mb-8 font-medium">{fir.incident_type} - {new Date(fir.incident_date).toLocaleDateString()}</p>
                
                {fir.status === 'REJECTED' ? (
                    <div className="bg-red-900/20 text-red-400 p-5 rounded-lg border border-red-800/50 shadow-inner">
                        <span className="font-bold uppercase tracking-widest block mb-1">Status: Refused</span>
                        This FIR was rejected by the commanding administration.
                    </div>
                ) : (
                    <div className="relative pl-2">
                        {/* Connecting Line */}
                        <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-[#334155]/60 shadow-[0_0_5px_rgba(51,65,85,0.5)]"></div>
                        
                        <div className="space-y-10 relative">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                
                                return (
                                    <div key={step.id} className="flex items-start space-x-6 relative">
                                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-[#0b1120] border-2 transition-all ${isCompleted ? 'text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-[#334155] border-[#334155]'}`}>
                                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className={`font-bold text-lg uppercase tracking-widest ${isCurrent ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                                                {step.label}
                                            </h3>
                                            {isCurrent && (
                                                <p className="text-sm font-medium text-blue-300 mt-2 bg-blue-900/20 px-4 py-2 rounded border border-blue-800/50">
                                                    Current Phase. {fir.case_details?.assigned_officer_details ? `Officer ${fir.case_details.assigned_officer_details.username} is leading investigations.` : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* If there are court dates, list them here */}
            {fir.case_details?.court_dates?.length > 0 && (
                <div className="official-card">
                    <h3 className="text-xl font-bold text-slate-200 mb-4 uppercase tracking-widest border-b border-[#334155]/60 pb-3">Scheduled Court Sessions</h3>
                    <ul className="space-y-4">
                        {fir.case_details.court_dates.map(date => (
                            <li key={date.id} className="flex items-start space-x-4 bg-[#0f172a]/60 p-4 rounded-lg border border-[#334155]/50 shadow-inner">
                                <Clock className="w-5 h-5 text-amber-500 mt-0.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                <div>
                                    <p className="font-bold text-amber-400 tracking-wide text-lg">{new Date(date.hearing_date).toLocaleString()}</p>
                                    {date.notes && <p className="text-sm text-slate-300 mt-1">{date.notes}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CaseTrack;
