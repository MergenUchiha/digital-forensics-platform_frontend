import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Cases } from '@/pages/Cases';
import { CaseDetails } from '@/pages/CaseDetails';
import { Evidence } from '@/pages/Evidence';
import { TimelinePage } from '@/pages/TimelinePage';
import { NetworkAnalysis } from '@/pages/NetworkAnalysis';
import { Reports } from '@/pages/Reports';
import { NotificationContainer } from '@/components/ui/Notification';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:id" element={<CaseDetails />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/network" element={<NetworkAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
              <p className="text-gray-400 mt-2">Coming soon...</p>
            </div>
          } />
        </Routes>
      </Layout>
      <NotificationContainer />
    </BrowserRouter>
  );
}

export default App;