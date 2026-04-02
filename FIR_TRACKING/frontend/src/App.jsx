import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import NewFIR from './pages/citizen/NewFIR';
import CaseTrack from './pages/citizen/CaseTrack';
import PoliceDashboard from './pages/police/PoliceDashboard';
import CaseDetails from './pages/police/CaseDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AllFIRs from './pages/admin/AllFIRs';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<Layout />}>
                <Route path="/citizen/dashboard" element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                        <CitizenDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/citizen/new-fir" element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                        <NewFIR />
                    </ProtectedRoute>
                } />
                <Route path="/citizen/track/:id" element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                        <CaseTrack />
                    </ProtectedRoute>
                } />
                
                <Route path="/police/dashboard" element={
                    <ProtectedRoute allowedRoles={['POLICE']}>
                        <PoliceDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/police/case/:id" element={
                    <ProtectedRoute allowedRoles={['POLICE']}>
                        <CaseDetails />
                    </ProtectedRoute>
                } />
                
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/firs" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AllFIRs />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
