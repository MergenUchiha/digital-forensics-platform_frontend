import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Cases } from '@/pages/Cases';
import { CaseDetails } from '@/pages/CaseDetails';
import { Evidence } from '@/pages/Evidence';
import { TimelinePage } from '@/pages/TimelinePage';
import { NetworkAnalysis } from '@/pages/NetworkAnalysis';
import { Reports } from '@/pages/Reports';
import { NotificationContainer } from '@/components/ui/Notification';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/cases/:id" element={<CaseDetails />} />
                    <Route path="/evidence" element={<Evidence />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/network" element={<NetworkAnalysis />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <NotificationContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;