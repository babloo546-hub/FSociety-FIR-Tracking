import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../api/axiosConfig';

const Register = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'CITIZEN' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // If already logged in, redirect based on role
    if (user) {
        return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />;
    }

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await api.post('auth/register/', formData);
            setMessage('Registration successful! Please login.');
            setError(null);
        } catch (err) {
            const errorMsg = err.response?.data?.username?.[0] || 
                           err.response?.data?.email?.[0] || 
                           err.response?.data?.detail || 
                           'Registration failed. Please try again.';
            setError(errorMsg);
            setMessage(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] opacity-90"></div>
            
            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl my-8">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 backdrop-blur rounded-full flex items-center justify-center border border-blue-400/30 shadow-inner">
                        <UserPlus className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">Register Account</h2>
                <p className="text-blue-200 text-center text-sm mb-8">Join the FIR Tracking System</p>
                
                {message && <div className="p-3 mb-6 bg-green-500/20 border border-green-500/50 text-green-200 text-sm rounded-lg text-center backdrop-blur">{message}</div>}
                {error && <div className="p-3 mb-6 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-lg text-center backdrop-blur">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Username</label>
                        <input type="text" name="username" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Email Address</label>
                        <input type="email" name="email" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
                        <input type="password" name="password" required onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-600/50 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-lg text-white font-semibold tracking-wide hover:shadow-lg hover:from-blue-400 hover:to-indigo-500 transition-all transform hover:-translate-y-0.5 mt-4">
                        Create Account
                    </button>
                    <p className="text-center text-sm text-blue-200 mt-6">
                        Already have an account? <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
