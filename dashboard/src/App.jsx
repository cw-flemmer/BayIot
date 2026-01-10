import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useTenant } from './context/TenantContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Signin from './pages/auth/Signin';
import Signup from './pages/auth/Signup';
import SiteAdminLogin from './pages/auth/SiteAdminLogin';
import Dashboard from './pages/dashboard/DashboardLayout';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  console.log('[App] ProtectedRoute: isAuthenticated=', isAuthenticated, 'loading=', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-['Outfit']">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-500 animate-pulse text-sm">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  console.log('[App] Rendering App component');
  return (
    <TenantProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/site-admin-8408" element={<SiteAdminLogin />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TenantProvider>
  );
}

export default App;
