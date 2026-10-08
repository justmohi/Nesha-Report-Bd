import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import RoleGuard from './components/common/RoleGuard';

// Public Pages
import HomePage from './pages/public/HomePage';
import ReportPage from './pages/public/ReportPage';
import MyReportsPage from './pages/public/MyReportsPage';
import ReportDetailPage from './pages/public/ReportDetailPage';
import TrackReportPage from './pages/public/TrackReportPage';
import PublicMapPage from './pages/public/PublicMapPage';
import SafetyPage from './pages/public/SafetyPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Police Pages
import PoliceDashboard from './pages/police/PoliceDashboard';
import PoliceReportsPage from './pages/police/PoliceReportsPage';
import PoliceReportDetailPage from './pages/police/PoliceReportDetailPage';
import PoliceMapPage from './pages/police/PoliceMapPage';
import PoliceNotificationsPage from './pages/police/PoliceNotificationsPage';
import PoliceProfilePage from './pages/police/PoliceProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminPolicePage from './pages/admin/AdminPolicePage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  const navigate = (tab: string, param?: string) => {
    if (param) {
      setSelectedReportId(param);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentTab) {
      // Public Routes
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'report':
        return <ReportPage onNavigate={navigate} />;
      case 'my-reports':
        return <MyReportsPage onNavigate={navigate} />;
      case 'report-detail':
        return (
          selectedReportId ? (
            <ReportDetailPage reportId={selectedReportId} onNavigate={navigate} />
          ) : (
            <HomePage onNavigate={navigate} />
          )
        );
      case 'track':
        return <TrackReportPage onNavigate={navigate} />;
      case 'map':
        return <PublicMapPage />;
      case 'safety':
        return <SafetyPage />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;

      // Police Routes (Protected)
      case 'police-dashboard':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('home')}
            onNavigateLogin={() => navigate('login')}
          >
            <PoliceDashboard onNavigate={navigate} />
          </RoleGuard>
        );
      case 'police-reports':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('police-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <PoliceReportsPage onNavigate={navigate} />
          </RoleGuard>
        );
      case 'police-report-detail':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('police-reports')}
            onNavigateLogin={() => navigate('login')}
          >
            {selectedReportId ? (
              <PoliceReportDetailPage reportId={selectedReportId} onNavigate={navigate} />
            ) : (
              <PoliceDashboard onNavigate={navigate} />
            )}
          </RoleGuard>
        );
      case 'police-map':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('police-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <PoliceMapPage onNavigate={navigate} />
          </RoleGuard>
        );
      case 'police-notifications':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('police-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <PoliceNotificationsPage onNavigate={navigate} />
          </RoleGuard>
        );
      case 'police-profile':
        return (
          <RoleGuard
            allowedRoles={['POLICE_USER', 'SUPER_ADMIN']}
            onBack={() => navigate('police-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <PoliceProfilePage />
          </RoleGuard>
        );

      // Super Admin Routes (Protected)
      case 'admin-dashboard':
        return (
          <RoleGuard
            allowedRoles={['SUPER_ADMIN']}
            onBack={() => navigate('home')}
            onNavigateLogin={() => navigate('login')}
          >
            <AdminDashboard onNavigate={navigate} />
          </RoleGuard>
        );
      case 'admin-reports':
        return (
          <RoleGuard
            allowedRoles={['SUPER_ADMIN']}
            onBack={() => navigate('admin-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <AdminReportsPage onNavigate={navigate} />
          </RoleGuard>
        );
      case 'admin-police':
        return (
          <RoleGuard
            allowedRoles={['SUPER_ADMIN']}
            onBack={() => navigate('admin-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <AdminPolicePage />
          </RoleGuard>
        );
      case 'admin-audit-logs':
        return (
          <RoleGuard
            allowedRoles={['SUPER_ADMIN']}
            onBack={() => navigate('admin-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <AdminAuditLogsPage />
          </RoleGuard>
        );
      case 'admin-settings':
        return (
          <RoleGuard
            allowedRoles={['SUPER_ADMIN']}
            onBack={() => navigate('admin-dashboard')}
            onNavigateLogin={() => navigate('login')}
          >
            <AdminSettingsPage />
          </RoleGuard>
        );

      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar currentTab={currentTab} onNavigate={navigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
