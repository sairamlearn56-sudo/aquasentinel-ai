import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import LiveMonitor from '@/pages/LiveMonitor';
import AIAnalysis from '@/pages/AIAnalysis';
import History from '@/pages/History';
import CommunityMap from '@/pages/CommunityMap';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import PersonalInfo from '@/pages/settings/PersonalInfo';
import AccountPrivacy from '@/pages/settings/AccountPrivacy';
import LanguageRegion from '@/pages/settings/LanguageRegion';
import NotificationsSettings from '@/pages/settings/NotificationsSettings';
import AppSettingsPage from '@/pages/settings/AppSettingsPage';
import WaterTracker from '@/pages/WaterTracker';
import WaterSourceDetail from '@/pages/WaterSourceDetail';
import { LanguageProvider } from '@/lib/LanguageContext';
import { VoiceProvider } from '@/lib/VoiceContext';
import VoiceIndicator from '@/components/VoiceIndicator';
import { AquaProvider } from '@/lib/AquaContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import AquaContainer from '@/components/aqua/AquaContainer';
import PageLoader from '@/components/PageLoader';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show premium loading screen while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <PageLoader text="Initializing AquaSentinel" subtext="Connecting to your AI health guardian" />
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitor" element={<LiveMonitor />} />
        <Route path="/analysis" element={<AIAnalysis />} />
        <Route path="/analysis/:scanId" element={<AIAnalysis />} />
        <Route path="/history" element={<History />} />
        <Route path="/map" element={<CommunityMap />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/personal" element={<PersonalInfo />} />
        <Route path="/settings/account" element={<AccountPrivacy />} />
        <Route path="/settings/language" element={<LanguageRegion />} />
        <Route path="/settings/notifications" element={<NotificationsSettings />} />
        <Route path="/settings/app" element={<AppSettingsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tracker" element={<WaterTracker />} />
        <Route path="/tracker/:id" element={<WaterSourceDetail />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
      <AquaContainer />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <ThemeProvider>
            <LanguageProvider>
              <VoiceProvider>
                <AquaProvider>
                  <AuthenticatedApp />
                  <VoiceIndicator />
                </AquaProvider>
              </VoiceProvider>
            </LanguageProvider>
          </ThemeProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App