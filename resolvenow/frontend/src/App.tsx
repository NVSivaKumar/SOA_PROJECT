import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useTheme } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import ParticleDrift from './components/originkit/ui/particle-drift';

import React from 'react';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <>
      <div className="fixed inset-0 -z-10 pointer-events-none transition-colors duration-500">
        <ParticleDrift 
          background="transparent" 
          baseColor={theme === 'dark' ? '#D4AF37' : '#999999'} 
          accentColor={theme === 'dark' ? '#E7C15C' : '#555555'} 
          density={350} 
          speed={40} 
          linkDistance={300}
          linkThickness={1.5}
        />
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'AGENT' ? '/agent/dashboard' : '/dashboard'} replace />} />
          
          {/* Customer Routes */}
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Dashboard /></ProtectedRoute>} />
          <Route path="complaints" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Complaints /></ProtectedRoute>} />
          <Route path="complaints/new" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><NewComplaint /></ProtectedRoute>} />
          <Route path="complaints/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'AGENT', 'ADMIN']}><ComplaintDetails /></ProtectedRoute>} />

          {/* Agent Routes */}
          <Route path="agent/dashboard" element={<ProtectedRoute allowedRoles={['AGENT']}><Dashboard role="AGENT" /></ProtectedRoute>} />
          <Route path="agent/tickets" element={<ProtectedRoute allowedRoles={['AGENT']}><Complaints role="AGENT" /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><Dashboard role="ADMIN" /></ProtectedRoute>} />
          <Route path="admin/complaints" element={<ProtectedRoute allowedRoles={['ADMIN']}><Complaints role="ADMIN" /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
