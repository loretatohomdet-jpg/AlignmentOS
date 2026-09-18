import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CharterCohortPage from './pages/CharterCohortPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import DiagnosticPage from './pages/DiagnosticPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetGuidePage from './pages/ResetGuidePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import PlannerPage from './pages/PlannerPage';
import AlignmentClarityPage from './pages/AlignmentClarityPage';
import QuarterlyReviewPage from './pages/QuarterlyReviewPage';
import InstitutionPage from './pages/InstitutionPage';
import PlatformPage from './pages/PlatformPage';
import FrameworkPage from './pages/FrameworkPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AlignmentMapPage from './pages/AlignmentMapPage';
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
import MorningAnchorPage from './pages/MorningAnchorPage';
import MiddayPausePage from './pages/MiddayPausePage';
import EveningClosePage from './pages/EveningClosePage';
import JourneyPage from './pages/JourneyPage';
import ReflectPage from './pages/ReflectPage';
import MorePage from './pages/MorePage';
import AgentPage from './pages/AgentPage';
import EthicsPage from './pages/EthicsPage';
import NotFoundPage from './pages/NotFoundPage';
import SuccessPage from './pages/SuccessPage';
import SnapshotPage from './pages/SnapshotPage';
import SharePage from './pages/SharePage';
import SharePublicPage from './pages/SharePublicPage';
import HeaderUserMenu from './components/HeaderUserMenu';
import AgentFloatingButton from './components/AgentFloatingButton';
import SiteMarketingHeader from './components/SiteMarketingHeader';
import { SitePageFooter } from './components/HomeMarketingChrome';
import { API_BASE } from './config/apiBase';
import { clearSession, getAccessToken, hasUnexpiredAccessToken, useAuthSession } from './utils/authSession';

/** Redirects to login with returnTo if not signed in. Use for routes that require authentication. */
function RequireAuth({ children }) {
  const location = useLocation();
  if (!hasUnexpiredAccessToken()) {
    const returnTo = encodeURIComponent(location.pathname || '/practice');
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return children;
}

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAuthSession();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserRole(null);
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          clearSession();
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => setUserRole(data?.role ?? null))
      .catch(() => setUserRole(null));
  }, [isLoggedIn, location.pathname]);

  const handleSetToken = () => {
    const token = window.prompt('Paste your JWT access token:');
    if (token) {
      localStorage.setItem('accessToken', token);
      window.dispatchEvent(new Event('alignment-auth'));
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  const immersiveAssessment = location.pathname === '/assessment';

  const handleDrawerLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const appendDesktop = (
    <>
      {/* md and up: Sign in or account menu; smaller screens use the mobile drawer. */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {!isLoggedIn ? (
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-medium text-alignment-accent/90 hover:text-alignment-accent transition-colors"
          >
            Sign In
          </NavLink>
        ) : (
          <HeaderUserMenu isLoggedIn={isLoggedIn} onLogout={handleDrawerLogout} />
        )}
        {import.meta.env.DEV && !immersiveAssessment && (
          <button
            type="button"
            onClick={handleSetToken}
            className="p-2 rounded-full text-alignment-accent/90 hover:text-alignment-accent hover:bg-alignment-accent/5 transition-colors"
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
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden flex flex-col bg-alignment-page">
      <SiteMarketingHeader
        appendDesktop={appendDesktop}
        authDrawer={{
          isLoggedIn,
          onLogout: handleDrawerLogout,
        }}
      />
      <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">{children}</main>
      {!immersiveAssessment && <AgentFloatingButton />}
      <SitePageFooter
        extra={
          userRole === 'ADMIN' ? (
            <NavLink
              to="/admin/overview"
              className="text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.14em] text-alignment-accent/65 hover:text-alignment-accent"
            >
              Admin
            </NavLink>
          ) : null
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cohort" element={<CharterCohortPage />} />
      <Route path="/s/:token" element={<SharePublicPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/go/alignment" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/reset-guide" element={<ResetGuidePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/alignment-clarity" element={<AlignmentClarityPage />} />
      <Route path="/shop/quarterly-review" element={<QuarterlyReviewPage />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/reset" element={<ResetGuidePage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/framework" element={<FrameworkPage />} />
      <Route path="/institution" element={<InstitutionPage />} />
      <Route path="/leaders" element={<ComingSoonPage variant="leaders" />} />
      <Route path="/organizations" element={<ComingSoonPage variant="organizations" />} />
      <Route path="/alignment-map" element={<AlignmentMapPage />} />
      <Route path="/map" element={<Navigate to="/alignment-map" replace />} />
      <Route path="/ethics" element={<Layout><EthicsPage /></Layout>} />
      <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace />} />
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
      <Route
        path="/journey"
        element={
          <RequireAuth>
            <Layout>
              <JourneyPage />
            </Layout>
          </RequireAuth>
        }
      />
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
      <Route path="/today" element={<Navigate to="/practice" replace />} />
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
        path="/practice/morning"
        element={
          <RequireAuth>
            <Layout>
              <MorningAnchorPage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/practice/midday"
        element={
          <RequireAuth>
            <Layout>
              <MiddayPausePage />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/practice/close"
        element={
          <RequireAuth>
            <Layout>
              <EveningClosePage />
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
        path="/snapshot"
        element={
          <RequireAuth>
            <Layout>
              <SnapshotPage />
            </Layout>
          </RequireAuth>
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
          <Layout>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </Layout>
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
