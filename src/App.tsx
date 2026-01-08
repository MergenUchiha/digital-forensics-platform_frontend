import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
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
import { Settings } from '@/pages/Settings';
import { NotificationContainer } from '@/components/ui/Notification';
import { Suspense } from 'react';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-bg-primary">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-text-secondary">Loading...</p>
    </div>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen bg-bg-primary">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-cyber-500 mb-4">404</h1>
      <p className="text-xl text-text-primary mb-4">Page Not Found</p>
      <p className="text-text-secondary mb-8">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white rounded-lg transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <ErrorBoundary>
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
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Layout>
                        </ErrorBoundary>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
              <NotificationContainer />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;