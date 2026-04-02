import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const NewFIR = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        incident_type: '',
        description: '',
        location: '',
        incident_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('fir-cases/firs/', formData);
            navigate('/citizen/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-gray-900">
            <h1 className="text-2xl font-bold mb-6">File New FIR</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                    <input
                        type="text" required
                        placeholder="e.g. Theft, Assault"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        onChange={e => setFormData({...formData, incident_type: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time of Incident</label>
                    <input
                        type="datetime-local" required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        onChange={e => setFormData({...formData, incident_date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text" required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required rows="5"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Submit FIR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewFIR;
