import { lazy, Suspense, type ReactElement } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useAuthContext } from '@/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell/AppShell';
import { Spinner } from '@/components/ui/Spinner/Spinner';

// Lazy-loaded pages
const LoginPage            = lazy(() => import('@/modules/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage        = lazy(() => import('@/modules/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MembersPage          = lazy(() => import('@/modules/members/pages/MembersPage').then(m => ({ default: m.MembersPage })));
const MemberDetailPage     = lazy(() => import('@/modules/members/pages/MemberDetailPage').then(m => ({ default: m.MemberDetailPage })));
const ServicesPage         = lazy(() => import('@/modules/services/pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AttendancePage       = lazy(() => import('@/modules/attendance/pages/AttendancePage').then(m => ({ default: m.AttendancePage })));
const AttendanceDetailPage = lazy(() => import('@/modules/attendance/pages/AttendanceDetailPage').then(m => ({ default: m.AttendanceDetailPage })));
const RosterPage           = lazy(() => import('@/modules/roster/pages/RosterPage').then(m => ({ default: m.RosterPage })));
const EventsPage           = lazy(() => import('@/modules/events/pages/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage      = lazy(() => import('@/modules/events/pages/EventDetailPage').then(m => ({ default: m.EventDetailPage })));

function PageLoader(): ReactElement {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <Spinner size="lg" />
    </div>
  );
}

function ProtectedRoute(): ReactElement {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: 'dashboard',
            element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>,
          },
          {
            path: 'attendance',
            element: <Suspense fallback={<PageLoader />}><AttendancePage /></Suspense>,
          },
          {
            path: 'attendance/:id',
            element: <Suspense fallback={<PageLoader />}><AttendanceDetailPage /></Suspense>,
          },
          {
            path: 'roster',
            element: <Suspense fallback={<PageLoader />}><RosterPage /></Suspense>,
          },
          {
            path: 'events',
            element: <Suspense fallback={<PageLoader />}><EventsPage /></Suspense>,
          },
          {
            path: 'events/:id',
            element: <Suspense fallback={<PageLoader />}><EventDetailPage /></Suspense>,
          },
          {
            path: 'members',
            element: <Suspense fallback={<PageLoader />}><MembersPage /></Suspense>,
          },
          {
            path: 'members/:id',
            element: <Suspense fallback={<PageLoader />}><MemberDetailPage /></Suspense>,
          },
          {
            path: 'services',
            element: <Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

export default function App(): ReactElement {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
