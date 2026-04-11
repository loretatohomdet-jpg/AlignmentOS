import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';

/** Redirects to login with returnTo if not signed in. Use for routes that require authentication. */
function RequireAuth({ children }) {
  const location = useLocation();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  if (!hasToken) {
    const returnTo = encodeURIComponent(location.pathname || '/dashboard');
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return children;
}
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import InstitutionPage from './pages/InstitutionPage';
import PlatformPage from './pages/PlatformPage';
import FrameworkPage from './pages/FrameworkPage';
import ComingSoonPage from './pages/ComingSoonPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import StartPage from './pages/StartPage';
import AdminLeadsPage from './pages/AdminLeadsPage';
import RequireAdmin from './components/RequireAdmin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminAssessmentsPage from './pages/admin/AdminAssessmentsPage';
import AdminAssessmentEditPage from './pages/admin/AdminAssessmentEditPage';
import BusinessAlignmentPage from './pages/BusinessAlignmentPage';
import ProgressPage from './pages/ProgressPage';
import PracticePage from './pages/PracticePage';
import ReflectPage from './pages/ReflectPage';
import MorePage from './pages/MorePage';
import AgentPage from './pages/AgentPage';
import EthicsPage from './pages/EthicsPage';
import NotFoundPage from './pages/NotFoundPage';
import SuccessPage from './pages/SuccessPage';
import SharePage from './pages/SharePage';
import HeaderUserMenu from './components/HeaderUserMenu';
import AgentFloatingButton from './components/AgentFloatingButton';
import BrandLogo from './components/BrandLogo';
import SiteMarketingHeader from './components/SiteMarketingHeader';
import { siteSecondaryFooter } from './config/footerNav';
import { API_BASE } from './config/apiBase';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => typeof window !== 'undefined' && !!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, [location.pathname]);

  useEffect(() => {
    const sync = () => setIsLoggedIn(!!localStorage.getItem('accessToken'));
    window.addEventListener('alignment-auth', sync);
    return () => window.removeEventListener('alignment-auth', sync);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserRole(null);
      return;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUserRole(data?.role ?? null))
      .catch(() => setUserRole(null));
  }, [isLoggedIn, location.pathname]);

  const handleSetToken = () => {
    const token = window.prompt('Paste your JWT access token:');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  const immersiveAssessment = location.pathname === '/assessment';

  const handleDrawerLogout = () => {
    try {
      localStorage.removeItem('accessToken');
    } catch (_) {}
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const appendDesktop = (
    <>
      {isLoggedIn && (
        <div className="md:hidden flex items-center shrink-0">
          <HeaderUserMenu isLoggedIn onLogout={() => setIsLoggedIn(false)} />
        </div>
      )}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-medium text-alignment-accent/70 hover:text-alignment-accent transition-colors"
          >
            Sign In
          </NavLink>
        ) : (
          <HeaderUserMenu isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
        )}
        {import.meta.env.DEV && !immersiveAssessment && (
          <button
            type="button"
            onClick={handleSetToken}
            className="p-2 rounded-full text-alignment-accent/70 hover:text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
            title="Dev: paste JWT"
            aria-label="Set JWT token (development)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-alignment-surface">
      <SiteMarketingHeader
        appendDesktop={appendDesktop}
        authDrawer={{
          isLoggedIn,
          onLogout: handleDrawerLogout,
        }}
      />
      <main className="flex-1">{children}</main>
      {!immersiveAssessment && <AgentFloatingButton />}
      <footer className="border-t border-alignment-accent/[0.06] mt-auto">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-sm text-alignment-accent/70">
          <BrandLogo iconHeightPx={40} className="shrink-0" />
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Footer">
            {siteSecondaryFooter.map((item) => (
              <NavLink key={item.to} to={item.to} className="hover:text-alignment-accent">
                {item.label}
              </NavLink>
            ))}
            {userRole === 'ADMIN' && (
              <NavLink to="/admin/overview" className="hover:text-alignment-accent">
                Admin
              </NavLink>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/go/alignment" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/framework" element={<FrameworkPage />} />
      <Route path="/institution" element={<InstitutionPage />} />
      <Route path="/leaders" element={<ComingSoonPage variant="leaders" />} />
      <Route path="/organizations" element={<ComingSoonPage variant="organizations" />} />
      <Route path="/alignment-map" element={<ComingSoonPage variant="alignment-map" />} />
      <Route path="/map" element={<Navigate to="/alignment-map" replace />} />
      <Route path="/ethics" element={<Layout><EthicsPage /></Layout>} />
      <Route path="/how-it-works" element={<Navigate to="/pricing" replace />} />
      {/* Short URLs — marketing / email friendly */}
      <Route
        path="/diagnostic"
        element={
          <Layout>
            <DiagnosticPage />
          </Layout>
        }
      />
      <Route path="/wholeness" element={<Navigate to="/ethics" replace />} />
      <Route path="/journey" element={<Navigate to="/pricing#journey-tier" replace />} />
      <Route path="/success" element={<Layout><SuccessPage /></Layout>} />
      <Route
        path="/share"
        element={
          <RequireAuth>
            <Layout>
              <SharePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/404" element={<Layout><NotFoundPage /></Layout>} />
      <Route
        path="/progress"
        element={
          <RequireAuth>
            <Layout>
              <ProgressPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/business"
        element={
          <Layout>
            <BusinessAlignmentPage />
          </Layout>
        }
      />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route path="/today" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/practice"
        element={
          <RequireAuth>
            <Layout>
              <PracticePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/reflect"
        element={
          <RequireAuth>
            <Layout>
              <ReflectPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/more"
        element={
          <RequireAuth>
            <Layout>
              <MorePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/agent"
        element={
          <RequireAuth>
            <Layout>
              <AgentPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Layout>
              <ProfilePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/assessment"
        element={
          <Layout>
            <AssessmentPage />
          </Layout>
        }
      />
      <Route
        path="/results"
        element={
          <RequireAuth>
            <Layout>
              <ResultsPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Layout>
              <AdminLayout />
            </Layout>
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="/admin/overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:userId" element={<AdminUserDetailPage />} />
        <Route path="assessments" element={<AdminAssessmentsPage />} />
        <Route path="assessments/:assessmentId" element={<AdminAssessmentEditPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
      </Route>
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
}
