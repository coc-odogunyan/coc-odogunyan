# Church Secretariat System — Full Build Specification

> **Stack:** React 18 · TypeScript · CSS Modules · React Router v6 · Supabase · Vite  
> **Design System:** Dark charcoal + gold (#e8c84a) derived from congregation brand identity  
> **Principles:** Module-first architecture · Mobile-first responsiveness · Offline-resilient (PWA) · Role-based access  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Scaffold & Structure](#2-project-scaffold--structure)
3. [Design System & CSS Tokens](#3-design-system--css-tokens)
4. [Auth Module](#4-auth-module)
5. [Layout & Shell Module](#5-layout--shell-module)
6. [Dashboard Module](#6-dashboard-module)
7. [Members Module](#7-members-module)
8. [Services Module](#8-services-module)
9. [Attendance Module](#9-attendance-module)
10. [Duty Roster Module](#10-duty-roster-module)
11. [Events Module](#11-events-module)
12. [Notifications Module](#12-notifications-module)
13. [Shared Components Library](#13-shared-components-library)
14. [Data Layer & Types](#14-data-layer--types)
15. [Routing & Access Control](#15-routing--access-control)
16. [PWA & Offline Strategy](#16-pwa--offline-strategy)
17. [Responsiveness Strategy](#17-responsiveness-strategy)
18. [Web Best Practices Checklist](#18-web-best-practices-checklist)

---

## 1. Project Overview

### Purpose

A Progressive Web App (PWA) for church secretariat operations. The system handles:

- Member registry management
- Attendance tracking per service
- Duty roster creation and assignment
- Event and announcement management
- WhatsApp/email notification dispatch
- Role-based access for Admin, Secretary, and Member roles

### User Roles

| Role | Permissions |
|---|---|
| `admin` | Full CRUD on all modules, user management, system settings |
| `secretary` | CRUD on attendance, rosters, events; read-only on member profile details |
| `member` | Read-only: own duties, upcoming events, own attendance history |

### Technology Decisions

- **Vite** over CRA for fast builds and native ESM dev server
- **CSS Modules** over Tailwind or styled-components — gives full control, zero runtime cost, and aligns with the "CSS for styling" requirement
- **Supabase** as the backend-as-a-service for Postgres, Auth, Realtime, and Storage
- **React Query (TanStack Query v5)** for server state, caching, and optimistic updates
- **React Router v6** with data loaders for route-level code splitting
- **Zod** for runtime schema validation on all forms
- **React Hook Form** for performant form state management

---

## 2. Project Scaffold & Structure

### Initialisation

```bash
npm create vite@latest church-secretariat -- --template react-ts
cd church-secretariat
npm install

# Core dependencies
npm install @supabase/supabase-js @tanstack/react-query react-router-dom
npm install react-hook-form zod @hookform/resolvers
npm install date-fns

# Dev dependencies
npm install -D @types/node vite-plugin-pwa
```

### Full Directory Structure

```
church-secretariat/
├── public/
│   ├── icons/                        # PWA icons (72,96,128,144,152,192,384,512px)
│   ├── manifest.json                 # PWA manifest
│   └── transparentBgLogo.png
│
├── src/
│   ├── main.tsx                      # App entry point
│   ├── App.tsx                       # Root component, router setup
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── logo-main.png
│   │   └── logo-transparent.png
│   │
│   ├── styles/
│   │   ├── tokens.css                # CSS custom properties (design tokens)
│   │   ├── reset.css                 # CSS reset / base
│   │   ├── typography.css            # Font stack, type scale
│   │   └── globals.css               # Global utility classes, animations
│   │
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client singleton
│   │   ├── queryClient.ts            # TanStack Query client config
│   │   └── utils.ts                  # Shared utility functions
│   │
│   ├── types/
│   │   ├── index.ts                  # Re-exports all types
│   │   ├── auth.types.ts
│   │   ├── member.types.ts
│   │   ├── service.types.ts
│   │   ├── attendance.types.ts
│   │   ├── roster.types.ts
│   │   └── event.types.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth state hook
│   │   ├── useRole.ts                # Role-checking hook
│   │   ├── useBreakpoint.ts          # Responsive breakpoint hook
│   │   ├── useDebounce.ts            # Search debounce
│   │   └── useLocalStorage.ts        # Offline state persistence
│   │
│   ├── components/                   # Shared UI component library
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Card.module.css
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Modal.module.css
│   │   │   ├── Avatar/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Avatar.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.module.css
│   │   │   ├── Select/
│   │   │   │   ├── Select.tsx
│   │   │   │   └── Select.module.css
│   │   │   ├── Textarea/
│   │   │   │   ├── Textarea.tsx
│   │   │   │   └── Textarea.module.css
│   │   │   ├── Spinner/
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── Spinner.module.css
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── EmptyState.module.css
│   │   │   ├── StatCard/
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── StatCard.module.css
│   │   │   ├── ProgressBar/
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   └── ProgressBar.module.css
│   │   │   └── Toast/
│   │   │       ├── Toast.tsx
│   │   │       ├── ToastContainer.tsx
│   │   │       └── Toast.module.css
│   │   │
│   │   └── layout/
│   │       ├── AppShell/
│   │       │   ├── AppShell.tsx
│   │       │   └── AppShell.module.css
│   │       ├── Sidebar/
│   │       │   ├── Sidebar.tsx
│   │       │   └── Sidebar.module.css
│   │       ├── TopBar/
│   │       │   ├── TopBar.tsx
│   │       │   └── TopBar.module.css
│   │       ├── MobileNav/
│   │       │   ├── MobileNav.tsx
│   │       │   └── MobileNav.module.css
│   │       └── PageHeader/
│   │           ├── PageHeader.tsx
│   │           └── PageHeader.module.css
│   │
│   └── modules/
│       ├── auth/
│       │   ├── pages/
│       │   │   ├── LoginPage.tsx
│       │   │   └── LoginPage.module.css
│       │   ├── components/
│       │   │   ├── LoginForm.tsx
│       │   │   └── LoginForm.module.css
│       │   ├── hooks/
│       │   │   └── useLogin.ts
│       │   └── auth.schema.ts
│       │
│       ├── dashboard/
│       │   ├── pages/
│       │   │   ├── DashboardPage.tsx
│       │   │   └── DashboardPage.module.css
│       │   ├── components/
│       │   │   ├── AttendanceTrend/
│       │   │   ├── UpcomingDuties/
│       │   │   ├── RecentServices/
│       │   │   └── NextServiceCard/
│       │   └── hooks/
│       │       └── useDashboardData.ts
│       │
│       ├── members/
│       │   ├── pages/
│       │   │   ├── MembersPage.tsx
│       │   │   ├── MembersPage.module.css
│       │   │   ├── MemberDetailPage.tsx
│       │   │   └── MemberDetailPage.module.css
│       │   ├── components/
│       │   │   ├── MemberTable/
│       │   │   ├── MemberCard/
│       │   │   ├── MemberForm/
│       │   │   └── MemberFilters/
│       │   ├── hooks/
│       │   │   ├── useMembers.ts
│       │   │   └── useMemberMutations.ts
│       │   └── members.schema.ts
│       │
│       ├── services/
│       │   ├── pages/
│       │   │   ├── ServicesPage.tsx
│       │   │   └── ServicesPage.module.css
│       │   ├── components/
│       │   │   ├── ServiceList/
│       │   │   └── ServiceForm/
│       │   ├── hooks/
│       │   │   └── useServices.ts
│       │   └── services.schema.ts
│       │
│       ├── attendance/
│       │   ├── pages/
│       │   │   ├── AttendancePage.tsx
│       │   │   ├── AttendancePage.module.css
│       │   │   ├── AttendanceDetailPage.tsx
│       │   │   └── AttendanceDetailPage.module.css
│       │   ├── components/
│       │   │   ├── AttendanceRoll/
│       │   │   ├── AttendanceSummary/
│       │   │   ├── AttendanceCheck/
│       │   │   └── ServiceSelector/
│       │   ├── hooks/
│       │   │   ├── useAttendance.ts
│       │   │   └── useMarkAttendance.ts
│       │   └── attendance.schema.ts
│       │
│       ├── roster/
│       │   ├── pages/
│       │   │   ├── RosterPage.tsx
│       │   │   └── RosterPage.module.css
│       │   ├── components/
│       │   │   ├── RosterTable/
│       │   │   ├── AssignmentForm/
│       │   │   ├── DutyCard/
│       │   │   └── ConfirmationStatus/
│       │   ├── hooks/
│       │   │   ├── useRoster.ts
│       │   │   └── useRosterMutations.ts
│       │   └── roster.schema.ts
│       │
│       └── events/
│           ├── pages/
│           │   ├── EventsPage.tsx
│           │   ├── EventsPage.module.css
│           │   ├── EventDetailPage.tsx
│           │   └── EventDetailPage.module.css
│           ├── components/
│           │   ├── EventCard/
│           │   ├── EventForm/
│           │   └── EventFilters/
│           ├── hooks/
│           │   ├── useEvents.ts
│           │   └── useEventMutations.ts
│           └── events.schema.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .env.local                        # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
└── .env.example
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'transparentBgLogo.png'],
      manifest: {
        name: 'Church Secretariat',
        short_name: 'Secretariat',
        description: 'Digital secretariat operations for the congregation',
        theme_color: '#1c1a17',
        background_color: '#1c1a17',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-api', networkTimeoutSeconds: 4 },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 3. Design System & CSS Tokens

All design tokens live in `src/styles/tokens.css` and are imported once in `main.tsx`. Every module's CSS file references these variables — never hardcodes colours or spacing.

### `src/styles/tokens.css`

```css
:root {
  /* === COLOURS === */
  --color-bg-base:        #1c1a17;
  --color-bg-surface:     #252320;
  --color-bg-card:        #2d2b27;
  --color-bg-card-hover:  #333130;
  --color-bg-elevated:    #3a3730;
  --color-bg-input:       #302e2a;

  --color-border:         #4a4740;
  --color-border-subtle:  #3a3830;
  --color-border-focus:   #e8c84a;

  --color-gold:           #e8c84a;
  --color-gold-dim:       #c4a832;
  --color-gold-bg:        rgba(232, 200, 74, 0.1);
  --color-gold-border:    rgba(232, 200, 74, 0.25);

  --color-white:          #f5f2eb;
  --color-text-primary:   #f5f2eb;
  --color-text-secondary: #b8b0a0;
  --color-text-muted:     #7a7468;
  --color-text-inverse:   #1c1a17;

  --color-success:        #5cba8a;
  --color-success-bg:     rgba(92, 186, 138, 0.1);
  --color-success-border: rgba(92, 186, 138, 0.25);

  --color-danger:         #e05c5c;
  --color-danger-bg:      rgba(224, 92, 92, 0.1);
  --color-danger-border:  rgba(224, 92, 92, 0.25);

  --color-info:           #5c8fe0;
  --color-info-bg:        rgba(92, 143, 224, 0.1);
  --color-info-border:    rgba(92, 143, 224, 0.25);

  --color-warn:           #e0a05c;
  --color-warn-bg:        rgba(224, 160, 92, 0.1);
  --color-warn-border:    rgba(224, 160, 92, 0.25);

  /* === TYPOGRAPHY === */
  --font-display:  'Georgia', 'Times New Roman', serif;
  --font-body:     'Trebuchet MS', 'Gill Sans', 'Gill Sans MT', sans-serif;
  --font-mono:     'Courier New', 'Courier', monospace;

  --text-xs:    0.6875rem;   /* 11px */
  --text-sm:    0.75rem;     /* 12px */
  --text-base:  0.8125rem;   /* 13px */
  --text-md:    0.9375rem;   /* 15px */
  --text-lg:    1.0625rem;   /* 17px */
  --text-xl:    1.25rem;     /* 20px */
  --text-2xl:   1.5rem;      /* 24px */
  --text-3xl:   1.875rem;    /* 30px */

  /* === SPACING === */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* === RADII === */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   10px;
  --radius-xl:   14px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.6);

  /* === TRANSITIONS === */
  --transition-fast:   150ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   300ms ease;

  /* === LAYOUT === */
  --sidebar-width:       220px;
  --sidebar-collapsed:   60px;
  --topbar-height:       56px;
  --mobile-nav-height:   60px;
  --content-max-width:   1200px;
  --page-padding-x:      var(--space-6);
  --page-padding-y:      var(--space-6);

  /* === BREAKPOINTS (reference only — use in JS via useBreakpoint) === */
  --bp-sm:  480px;
  --bp-md:  768px;
  --bp-lg:  1024px;
  --bp-xl:  1280px;
}
```

### `src/styles/reset.css`

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100dvh;
}

img, svg, video { display: block; max-width: 100%; }

input, button, textarea, select {
  font: inherit;
  color: inherit;
}

button { cursor: pointer; border: none; background: none; }

a { color: inherit; text-decoration: none; }

ul, ol { list-style: none; }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: normal;
  line-height: 1.3;
}

:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

::selection {
  background: var(--color-gold-bg);
  color: var(--color-gold);
}
```

### `src/styles/globals.css`

```css
/* Utility classes used across modules */

.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-3);
}

.divider {
  height: 1px;
  background: var(--color-border-subtle);
  border: none;
  margin: var(--space-5) 0;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

@keyframes slideInUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn var(--transition-slow) ease both;
}
```

---

## 4. Auth Module

### Purpose
Handles sign-in, session management, and route protection. Uses Supabase Auth with email/password. Supports three roles stored in the `members` table.

### Files

#### `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

#### `src/hooks/useAuth.ts`
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Member } from '@/types/member.types';

interface AuthState {
  session: Session | null;
  user: User | null;
  member: Member | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    session: null, user: null, member: null, isLoading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const member = await fetchMemberProfile(session.user.id);
        setState({ session, user: session.user, member, isLoading: false });
      } else {
        setState(s => ({ ...s, isLoading: false }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          const member = await fetchMemberProfile(session.user.id);
          setState({ session, user: session.user, member, isLoading: false });
        } else {
          setState({ session: null, user: null, member: null, isLoading: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return state;
}

async function fetchMemberProfile(userId: string): Promise<Member | null> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('auth_user_id', userId)
    .single();
  return data ?? null;
}
```

#### `src/hooks/useRole.ts`
```typescript
import { useAuth } from './useAuth';
import type { MemberRole } from '@/types/member.types';

export function useRole() {
  const { member } = useAuth();
  const role = member?.role ?? null;

  return {
    role,
    isAdmin: role === 'admin',
    isSecretary: role === 'secretary' || role === 'admin',
    isMember: role !== null,
    can: (action: 'write' | 'admin') => {
      if (action === 'admin') return role === 'admin';
      if (action === 'write') return role === 'admin' || role === 'secretary';
      return role !== null;
    },
  };
}
```

### Login Page

**File:** `src/modules/auth/pages/LoginPage.tsx`

**Behaviour:**
- Centred single-column layout at all breakpoints
- Logo mark (SVG recreation of the CC mark) at top
- Email + password form fields with proper `autocomplete` attributes (`email`, `current-password`)
- "Sign in" button — shows spinner while loading
- Error banner if credentials fail (e.g. "Invalid email or password")
- On success: redirect to `/dashboard`
- No "create account" flow — accounts are created by admin

**Form validation schema (`auth.schema.ts`):**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**`LoginPage.module.css` structure:**
```css
.page { /* full viewport, centred flex column */ }
.logoMark { /* 64x64 SVG container, centred */ }
.heading { /* font-display, 22px, white */ }
.subheading { /* font-body, 10px, gold, uppercase, tracked */ }
.card { /* max-width 400px, bg-card, border, radius-xl, padding 36px */ }
.errorBanner { /* danger-bg, danger-border, border-radius-md, padding */ }
.roleHint { /* muted, 11px, centred, bottom of card */ }

/* Mobile — card fills screen with no border-radius on sides */
@media (max-width: 480px) {
  .card { border-radius: 0; margin: 0 -1rem; max-width: none; }
}
```

---

## 5. Layout & Shell Module

### AppShell

**File:** `src/components/layout/AppShell/AppShell.tsx`

This is the persistent wrapper for all authenticated pages. It renders differently across breakpoints:

- **Desktop (≥1024px):** Fixed left sidebar (220px) + scrollable main content area
- **Tablet (768px–1023px):** Collapsed icon-only sidebar (60px) + main content; sidebar expands on hover/tap
- **Mobile (<768px):** No sidebar; fixed bottom navigation bar with 5 tabs

```typescript
interface AppShellProps {
  children: React.ReactNode;
}

// Internal state: isMobileMenuOpen (boolean)
// Uses: useBreakpoint() to render correct layout variant
```

**`AppShell.module.css`:**
```css
.shell {
  display: flex;
  min-height: 100dvh;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  /* ... */
}

.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* prevent flex overflow */
}

.main {
  flex: 1;
  padding: var(--page-padding-y) var(--page-padding-x);
  overflow-x: hidden;
}

@media (max-width: 1023px) {
  .sidebar { width: var(--sidebar-collapsed); }
}

@media (max-width: 767px) {
  .shell { flex-direction: column; }
  .sidebar { display: none; }
  .main { padding-bottom: calc(var(--mobile-nav-height) + var(--space-4)); }
}
```

### Sidebar

**File:** `src/components/layout/Sidebar/Sidebar.tsx`

Navigation items with icons. Active state uses gold left border + gold text + gold-tinted background.

**Navigation items:**
```typescript
const NAV_ITEMS = [
  { label: 'Dashboard',   path: '/dashboard',  icon: GridIcon,      roles: ['admin','secretary','member'] },
  { label: 'Attendance',  path: '/attendance', icon: CheckIcon,     roles: ['admin','secretary'] },
  { label: 'Duty Roster', path: '/roster',     icon: CalendarIcon,  roles: ['admin','secretary'] },
  { label: 'Events',      path: '/events',     icon: BellIcon,      roles: ['admin','secretary','member'] },
  { label: 'Members',     path: '/members',    icon: UsersIcon,     roles: ['admin','secretary'] },
] as const;
```

Filter nav items by the current user's role before rendering.

**Collapsed state (tablet):** Show only icon, tooltip on hover using CSS `title` attribute + custom tooltip component.

**Bottom of sidebar:** Show user avatar, name (truncated), and role badge. Clicking opens a dropdown with "My Profile" and "Sign Out".

### TopBar

**File:** `src/components/layout/TopBar/TopBar.tsx`

Shown on desktop and tablet. Contains:
- **Left:** Page title (passed as prop via context or Router location)
- **Right:** Next service badge (if within 7 days), notification bell (future), user avatar

### MobileNav

**File:** `src/components/layout/MobileNav/MobileNav.tsx`

Fixed bottom bar, visible only on mobile (<768px). Contains 5 icon-only tabs (Dashboard, Attendance, Roster, Events, Members). Active tab icon is filled gold. Uses `NavLink` from React Router.

```css
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--mobile-nav-height);
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  display: flex;
  z-index: 100;
  /* safe area for iPhone home indicator */
  padding-bottom: env(safe-area-inset-bottom);
}

.navItem {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.navItem.active { color: var(--color-gold); }
```

### `useBreakpoint` Hook

```typescript
// src/hooks/useBreakpoint.ts
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint());

  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}

function getBreakpoint(): Breakpoint {
  if (window.innerWidth < 768) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
}
```

---

## 6. Dashboard Module

### Purpose
Overview of the congregation's secretariat health. First screen after login. Adapts content density to the logged-in role.

### Page: `DashboardPage.tsx`

**Route:** `/dashboard`

**Layout:** Two-column grid on desktop, single column on mobile/tablet.

**Content sections:**

#### A. Stats Row
Four `StatCard` components in a 4-column grid (2-column on tablet, 2-column on mobile).

| Stat | Source | Accent |
|---|---|---|
| Total Members | `members` count | gold |
| Last Sunday Attendance | latest Sunday `attendance` aggregate | success |
| Unconfirmed Duties | `duty_assignments` where status = pending, service = next upcoming | danger |
| Upcoming Events | `events` count within 30 days | info |

#### B. Attendance Trend Chart (custom CSS bar chart)
No external chart library needed for v1. Render as a flex row of bars. Each bar height is proportional to attendance count vs. max count. Show last 8 Sunday services. On hover, show a tooltip with exact count and date.

```typescript
interface TrendBar {
  date: string;
  count: number;
  isLatest: boolean;
}
```

Bars: `background: var(--color-gold)` with variable opacity (0.5 → 1.0 from oldest to newest). Latest bar is full gold.

#### C. Recent Services Table (desktop) / Service Cards (mobile)
Last 5 services. Columns: Date, Type, Attendance count, Rate (badge). On mobile, each service renders as a compact card.

#### D. Unconfirmed Duties for Next Service
A list of duty assignments where `status = 'pending'` for the next upcoming service. Each row: role name, assigned member avatar + name, status badge. "Send All Reminders" button (secretary/admin only) — triggers WhatsApp notification flow.

#### E. Next Service Card (Sidebar / Top of mobile)
Always visible. Shows: service type, date, time, theme (if set), count of assigned duties vs total slots.

### `useDashboardData.ts`

```typescript
// Fetches all dashboard data in parallel using Promise.all
// Returns: { stats, trendData, recentServices, pendingDuties, nextService, isLoading, error }
// Caches with staleTime: 2 minutes
```

### `DashboardPage.module.css` key rules:
```css
.statsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.contentGrid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--space-5);
  margin-top: var(--space-5);
}

@media (max-width: 1199px) {
  .statsGrid { grid-template-columns: repeat(2, 1fr); }
  .contentGrid { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
  .statsGrid { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
}

@media (max-width: 480px) {
  .statsGrid { grid-template-columns: 1fr 1fr; }
}
```

---

## 7. Members Module

### Purpose
The source of truth for all congregation members. Manages registration, contact info, department assignment, and role access.

### Pages

#### A. `MembersPage.tsx` — Member Registry

**Route:** `/members` (admin/secretary only)

**Features:**

1. **Search bar** — debounced 300ms, searches `full_name` and `phone` fields
2. **Filter bar** — dropdowns for Department, Role, Status (active/inactive). Filters are applied client-side after initial fetch.
3. **View toggle** — Table view (desktop default) / Card grid view (mobile default). Toggle persisted to `localStorage`.
4. **Table view columns:** Avatar + Name, Department, Role badge, Last attendance date, Attendance rate (progress bar), Status badge, Actions (View, Edit)
5. **Card view:** A 2-3 column grid of `MemberCard` components on tablet/desktop, single column on mobile

**Sorting:** Click table column headers to sort. Active sort shows a small arrow indicator.

**Pagination:** 25 members per page. Show page numbers + previous/next. On mobile: infinite scroll (load more on scroll to bottom).

**Add Member button:** Opens `MemberForm` in a modal (admin/secretary). Full-width slide-up sheet on mobile.

#### B. `MemberDetailPage.tsx`

**Route:** `/members/:id`

**Sections:**

1. **Profile header** — Large avatar (initials or photo), full name, role badge, department, join date, status toggle (admin only)
2. **Contact info** — Phone, email (editable by admin/secretary)
3. **Attendance history** — A list of last 20 services with present/absent/excused status
4. **Duty history** — Last 10 assignments with service date, role, confirmation status
5. **Edit button** — Opens inline edit mode (admin/secretary)

### `MemberForm` Component

**Fields and validation:**

```typescript
// members.schema.ts
export const memberSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  department: z.enum(['choir','ushers','elders','media','welfare','youths','general']),
  role: z.enum(['admin','secretary','member']),
  gender: z.enum(['male','female']).optional(),
  is_active: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});
```

**UX notes:**
- All form fields use the shared `Input` / `Select` components
- On save, show inline success feedback before closing modal
- Destructive actions (deactivate, delete) require a confirmation dialog with explicit text confirmation

### Hooks

```typescript
// useMembers.ts
// - useQuery: fetches paginated members from Supabase
// - Supports: search, department filter, role filter, status filter
// - staleTime: 5 minutes
// - Returns: { members, totalCount, isLoading, error, refetch }

// useMemberMutations.ts
// - useCreateMember: POST to members table
// - useUpdateMember: PATCH to members table
// - useDeactivateMember: PATCH is_active = false
// - All mutations: invalidate 'members' query on success
// - All mutations: show toast on success/error
```

### `MembersPage.module.css` key rules:
```css
.controls {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--space-5);
}

.searchInput { flex: 1; min-width: 200px; }

.cardGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1023px) { .cardGrid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .cardGrid { grid-template-columns: 1fr; } }
```

---

## 8. Services Module

### Purpose
Services are the scheduling backbone. Every attendance record and duty assignment is linked to a service. This module manages the service calendar.

### Page: `ServicesPage.tsx`

**Route:** `/services` (admin/secretary)

**Features:**
1. A chronological list of services — future services at top, past below the "today" divider
2. Each service shows: type badge (Sunday/Wednesday/Friday/Special), date, theme, total attendance (if past), assigned duties count
3. **Add Service** button (admin/secretary) — modal form

### `ServiceForm` Component

**Fields:**
```typescript
// services.schema.ts
export const serviceSchema = z.object({
  service_type: z.enum(['sunday','wednesday','friday','special']),
  service_date: z.string().min(1, 'Date is required'),
  service_time: z.string().optional(),
  theme: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});
```

**UX:** Date picker uses native `<input type="date">` (best cross-device support). Service time uses `<input type="time">`. On creation, offer to immediately create a duty roster for that service.

---

## 9. Attendance Module

### Purpose
Record and view attendance for each service. Supports bulk marking, individual toggling, and offline-first submission.

### Pages

#### A. `AttendancePage.tsx` — Service Selection

**Route:** `/attendance`

**Layout:** A list/grid of recent and upcoming services. Each item shows:
- Service type, date
- Attendance status: "Not marked", "In progress (X/Y)", "Complete (X present)"
- A "Mark Attendance" CTA for unrecorded services (secretary/admin)

On mobile: vertically stacked service cards. On desktop: a two-column grid.

#### B. `AttendanceDetailPage.tsx` — The Roll Call

**Route:** `/attendance/:serviceId`

This is the most frequently-used screen on-site during service. Design for speed and fat-finger friendliness.

**Layout:**
- **Top summary bar:** Present / Absent / Excused counts with progress bars. Updates in real time as marks are toggled.
- **Controls row:** Search input, department filter dropdown, "Mark All Present" shortcut button
- **Member roll:** Vertically scrollable list. Each row:
  - Avatar (initials)
  - Full name
  - Department (muted)
  - Three toggle buttons: ✓ Present | – Absent | E Excused

**Attendance toggle behaviour:**
- Tapping a status button immediately updates the local state (optimistic update)
- Debounced 800ms before writing to Supabase
- Visual: active state has filled background; inactive state is ghost outline
- If offline: change is stored in localStorage and synced when connection restores

**Touch targets:** All toggle buttons minimum 44×44px (WCAG 2.5.8 compliance).

**Save button:** Fixed at the bottom (mobile) or top-right (desktop). Shows "Saved" with checkmark on successful flush.

### `AttendanceSummary` Component

```typescript
interface AttendanceSummaryProps {
  present: number;
  absent: number;
  excused: number;
  total: number;
}
// Renders three stat blocks + a single composite progress bar
// Green fill proportional to present, amber for excused, rest = absent
```

### `AttendanceCheck` Component

```typescript
interface AttendanceCheckProps {
  status: 'present' | 'absent' | 'excused' | null;
  onChange: (status: 'present' | 'absent' | 'excused') => void;
  disabled?: boolean;
}
```

```css
/* AttendanceCheck.module.css */
.group {
  display: flex;
  gap: var(--space-1);
}

.btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-input);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.present.active { background: var(--color-success); border-color: var(--color-success); color: white; }
.btn.absent.active  { background: var(--color-danger);  border-color: var(--color-danger);  color: white; }
.btn.excused.active { background: var(--color-gold);    border-color: var(--color-gold);    color: var(--color-text-inverse); }

/* Larger touch targets on mobile */
@media (max-width: 767px) {
  .btn { width: 44px; height: 44px; }
}
```

### Offline Attendance Sync

```typescript
// hooks/useMarkAttendance.ts
// On each status change:
// 1. Update local React state immediately (optimistic)
// 2. Store pending changes in localStorage key: `attendance_pending_${serviceId}`
// 3. On online event: flush all pending changes to Supabase
// 4. On successful flush: clear localStorage key

// Pending change shape:
interface PendingAttendanceChange {
  memberId: string;
  serviceId: string;
  status: 'present' | 'absent' | 'excused';
  timestamp: number;
}
```

---

## 10. Duty Roster Module

### Purpose
Assign brethren to specific roles for each service. Track confirmation status. Trigger notifications.

### Page: `RosterPage.tsx`

**Route:** `/roster`

**Layout:** Two-panel on desktop — left panel: service selector list; right panel: roster for selected service. On mobile: navigate into the service first, then see the full-screen roster.

### Features

#### A. Service Navigation
Left sidebar (desktop) or top service selector (mobile/tablet): list of upcoming services. Selecting a service loads its roster in the main panel.

#### B. Assignment Table
Columns: Duty Role, Assigned Member, Status, Notification Sent, Actions.

Status badges: `Confirmed` (success), `Pending` (danger), `Reminded` (gold/warn), `Swapped` (info).

#### C. Quick Assign Panel (desktop right drawer, mobile bottom sheet)
- Dropdown: Duty Role (from `duty_roles` table)
- Dropdown: Assign To (filtered by department if role has a department association)
- "Assign + Notify" button — creates the record and immediately queues a WhatsApp/notification

#### D. Confirmation Summary Card
Shows X of Y duties confirmed with a progress bar. "Send Reminders to Pending" button — sends notifications to all members with status = pending.

#### E. Swap Mechanism
Any assignment can be swapped. Clicking "Swap" opens a modal: search for another member → confirm swap → old record updated to `swapped`, new record created as `pending`, new member notified.

### Duty Roles Management
Accessed via Settings (admin only). A simple CRUD list of role definitions:
```
name: "1st Reader"
department: null (or "all")
description: "Reads the first lesson during service"
```

### `AssignmentForm` Component

```typescript
// roster.schema.ts
export const assignmentSchema = z.object({
  service_id: z.string().uuid(),
  member_id: z.string().uuid(),
  duty_role_id: z.string().uuid(),
  notify_immediately: z.boolean().default(true),
});
```

### Hooks

```typescript
// useRoster.ts
// - Fetches all assignments for a given service_id
// - Joins: duty_roles (name), members (full_name, phone, avatar)
// - staleTime: 1 minute (rosters change frequently near service dates)

// useRosterMutations.ts
// - useAssignDuty: insert into duty_assignments
// - useSwapAssignment: two-step update in a Supabase RPC transaction
// - useUpdateStatus: PATCH status on a single assignment
// - useSendReminderAll: calls Supabase Edge Function to queue notifications
```

### `RosterPage.module.css`

```css
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-5);
  height: calc(100vh - var(--topbar-height) - 2 * var(--page-padding-y));
}

.serviceList {
  overflow-y: auto;
  border-right: 1px solid var(--color-border-subtle);
  padding-right: var(--space-4);
}

.rosterPanel {
  overflow-y: auto;
}

@media (max-width: 1023px) {
  .layout { grid-template-columns: 1fr; height: auto; }
  .serviceList { border-right: none; border-bottom: 1px solid var(--color-border-subtle); padding-right: 0; padding-bottom: var(--space-4); }
}
```

---

## 11. Events Module

### Purpose
Create, publish, and manage church events and announcements. Members can view published events. Eventually feeds into a projector display view.

### Pages

#### A. `EventsPage.tsx` — Event List

**Route:** `/events`

**For secretary/admin:** Full CRUD list with filter tabs (All / Published / Draft / Archived). "New Event" button.

**For members:** Read-only list of published events sorted by date. No create/edit controls shown.

**Layout:**
- Desktop: Two-column grid of `EventCard` components
- Tablet: Two-column grid, slightly smaller cards
- Mobile: Full-width stacked cards

#### B. `EventDetailPage.tsx`

**Route:** `/events/:id`

Full detail view: title, date/time, type badge, full description, location (if set), created by, attachments (if any). Edit button (admin/secretary only).

### `EventCard` Component

```typescript
interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onArchive?: (id: string) => void;
  showActions?: boolean;
}
```

The card has a prominent date block on the left (day number in display font + 3-letter month abbreviation, styled in gold on dark). Event title, type badge, and short description to the right.

Published events: gold-accented date block. Drafts: muted grey date block.

### `EventForm` Component

**Fields:**
```typescript
// events.schema.ts
export const eventSchema = z.object({
  title: z.string().min(3, 'Title is required').max(100),
  description: z.string().max(2000).optional(),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().optional(),
  event_type: z.enum(['announcement','program','outreach','special']),
  location: z.string().max(200).optional(),
  is_published: z.boolean().default(false),
});
```

**UX:**
- "Save as Draft" and "Publish" are two separate buttons. Both submit the form but with different `is_published` values.
- Unpublishing a published event shows a confirmation ("Members will no longer see this event").
- Rich text description: use a simple `<textarea>` in v1. Markdown rendering on the detail page.

### Hooks

```typescript
// useEvents.ts
// - Fetches events with filter support (type, status, date range)
// - Members see: is_published = true only (enforced at DB level via RLS)
// - staleTime: 5 minutes

// useEventMutations.ts
// - useCreateEvent, useUpdateEvent, useArchiveEvent
// - On publish: optionally trigger notification to all members
```

---

## 12. Notifications Module

### Purpose
Queue and send WhatsApp messages and in-app notifications for duty assignments, event reminders, and attendance absences.

### Architecture

Notifications are triggered by user actions in the Roster and Events modules. They are processed by a **Supabase Edge Function**, not the client.

**Client side:** A `sendNotification()` utility that calls the Supabase Edge Function via RPC.

**Edge Function (`notify`):**
- Input: `{ type, recipient_id, payload }`
- Fetches member phone from DB
- Calls WhatsApp Cloud API (Meta Business) to send a templated message
- Logs to `notification_log` table with status and timestamp

### Notification Types

| Type | Trigger | Template |
|---|---|---|
| `duty_assigned` | New duty assignment created | "Hi [Name], you've been assigned as [Role] for [Service Type] on [Date]." |
| `duty_reminder` | Manual "Send Reminder" click | "Reminder: You're scheduled as [Role] for [Service Type] on [Date]. Please confirm." |
| `event_published` | Event published (optional broadcast) | "New announcement from the secretariat: [Title] on [Date]." |
| `duty_swapped` | Swap accepted | "Your duty for [Service] has been reassigned. [New member] will serve as [Role]." |

### In-App Toast Notifications

Used for immediate feedback after mutations. The `ToastContainer` sits at the top of the `AppShell` and subscribes to a global `toast` event bus.

```typescript
// lib/toast.ts — Lightweight event emitter, no external dependency
type ToastType = 'success' | 'error' | 'info' | 'warn';

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export const toast = {
  success: (message: string) => dispatch({ type: 'success', message }),
  error:   (message: string) => dispatch({ type: 'error',   message }),
  info:    (message: string) => dispatch({ type: 'info',    message }),
  warn:    (message: string) => dispatch({ type: 'warn',    message }),
};
```

**Toast UI:** Slides in from top-right on desktop, top-centre on mobile. Auto-dismisses after 4 seconds. Can be manually dismissed. Maximum 3 toasts visible at once; queue for overflow.

---

## 13. Shared Components Library

All components in `src/components/ui/` are generic, unstyled by default, and accept a `className` prop for module-level overrides.

### `Button`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

- `primary`: gold background, black text
- `ghost`: transparent, border, muted text
- `danger`: danger-bg, danger border, danger text
- `isLoading`: replaces children with a `Spinner` and disables the button

```css
/* Button.module.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  letter-spacing: 0.03em;
  transition: all var(--transition-fast);
  white-space: nowrap;
  cursor: pointer;
}

.primary { background: var(--color-gold); color: var(--color-text-inverse); border: none; }
.primary:hover { background: var(--color-gold-dim); }

.ghost { background: transparent; border: 1px solid var(--color-border); color: var(--color-text-secondary); }
.ghost:hover { border-color: var(--color-text-secondary); color: var(--color-text-primary); }

.danger { background: var(--color-danger-bg); border: 1px solid var(--color-danger-border); color: var(--color-danger); }
.danger:hover { background: var(--color-danger); color: white; }

.sm { padding: var(--space-1) var(--space-3); font-size: var(--text-sm); }
.md { padding: var(--space-2) var(--space-4); }
.lg { padding: var(--space-3) var(--space-6); font-size: var(--text-md); }

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

### `Input`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}
```

Always renders a `<label>` (visually hidden if `label` not provided but still present for a11y). Error state: danger-coloured border + error message below. Hint: muted text below input.

```css
.wrapper { display: flex; flex-direction: column; gap: var(--space-1); }
.label { font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); }
.input {
  width: 100%;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}
.input:focus { border-color: var(--color-gold); outline: none; }
.input.hasError { border-color: var(--color-danger); }
.error { font-size: var(--text-xs); color: var(--color-danger); }
```

### `Modal`

Renders into a React Portal (`document.body`). Traps focus. Closes on Escape key and backdrop click. Slide-up animation on mobile, fade+scale on desktop.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

On mobile (`<768px`): all modals become bottom sheets (fixed to bottom, slide up, rounded top corners, drag-to-close gesture via `touch` events).

```css
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: fadeIn var(--transition-base) ease;
}

.sm { max-width: 360px; }
.md { max-width: 520px; }
.lg { max-width: 720px; }

@media (max-width: 767px) {
  .overlay { align-items: flex-end; }
  .panel {
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    max-height: 92dvh;
    animation: slideInUp var(--transition-base) ease;
  }
}
```

### `StatCard`

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'gold' | 'success' | 'danger' | 'info';
  trend?: { value: number; direction: 'up' | 'down' };
}
```

Renders with a 2px top border in the accent colour. Large display-font number. Muted label above, sub below.

### `Avatar`

```typescript
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  imageUrl?: string;
  role?: MemberRole;
}
```

Extracts initials from `name`. Background colour is deterministically assigned from the member's role (gold for secretary, info for admin, success/muted cycling for members). If `imageUrl` is provided, shows the image.

### `Badge`

```typescript
interface BadgeProps {
  variant: 'success' | 'danger' | 'gold' | 'info' | 'warn' | 'muted';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}
```

Pill shape, uppercase, small font. Used throughout all modules for status display.

### `EmptyState`

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

Used when a list/table has no results. Centred layout, muted icon, title in white, description in muted, optional CTA button.

### `Spinner`

Simple rotating circle using CSS `@keyframes spin`. Accepts `size` and `color` props. Used inside `Button` (isLoading) and as full-page loader.

### `ProgressBar`

```typescript
interface ProgressBarProps {
  value: number;        // 0–100
  max?: number;         // default 100
  color?: 'gold' | 'success' | 'danger' | 'info';
  height?: number;      // px, default 4
  showLabel?: boolean;
}
```

---

## 14. Data Layer & Types

### Type Definitions

#### `src/types/member.types.ts`
```typescript
export type MemberRole = 'admin' | 'secretary' | 'member';
export type Department = 'choir' | 'ushers' | 'elders' | 'media' | 'welfare' | 'youths' | 'general';

export interface Member {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  role: MemberRole;
  department: Department;
  gender: 'male' | 'female' | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type MemberInsert = Omit<Member, 'id' | 'created_at' | 'updated_at'>;
export type MemberUpdate = Partial<MemberInsert>;
```

#### `src/types/service.types.ts`
```typescript
export type ServiceType = 'sunday' | 'wednesday' | 'friday' | 'special';

export interface Service {
  id: string;
  service_type: ServiceType;
  service_date: string;          // ISO date string YYYY-MM-DD
  service_time: string | null;   // HH:MM
  theme: string | null;
  notes: string | null;
  created_by: string;
  created_at: string;
}
```

#### `src/types/attendance.types.ts`
```typescript
export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  service_id: string;
  member_id: string;
  status: AttendanceStatus;
  marked_by: string;
  marked_at: string;
}

// Joined type for display
export interface AttendanceRecordWithMember extends AttendanceRecord {
  member: Pick<Member, 'id' | 'full_name' | 'department'>;
}
```

#### `src/types/roster.types.ts`
```typescript
export type AssignmentStatus = 'assigned' | 'confirmed' | 'reminded' | 'swapped' | 'declined';

export interface DutyRole {
  id: string;
  name: string;
  department: Department | null;
  description: string | null;
}

export interface DutyAssignment {
  id: string;
  service_id: string;
  member_id: string;
  duty_role_id: string;
  status: AssignmentStatus;
  assigned_by: string;
  notified_at: string | null;
  created_at: string;
}

// Joined type for display
export interface DutyAssignmentFull extends DutyAssignment {
  member: Pick<Member, 'id' | 'full_name' | 'phone' | 'department'>;
  duty_role: DutyRole;
  service: Service;
}
```

#### `src/types/event.types.ts`
```typescript
export type EventType = 'announcement' | 'program' | 'outreach' | 'special';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: EventType;
  location: string | null;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Supabase Database Schema (SQL)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Members
create table members (
  id              uuid primary key default uuid_generate_v4(),
  auth_user_id    uuid references auth.users(id) on delete set null,
  full_name       text not null,
  phone           text not null,
  email           text,
  role            text not null default 'member' check (role in ('admin','secretary','member')),
  department      text not null default 'general',
  gender          text check (gender in ('male','female')),
  is_active       boolean not null default true,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Services
create table services (
  id              uuid primary key default uuid_generate_v4(),
  service_type    text not null check (service_type in ('sunday','wednesday','friday','special')),
  service_date    date not null,
  service_time    time,
  theme           text,
  notes           text,
  created_by      uuid references members(id),
  created_at      timestamptz not null default now()
);

-- Attendance
create table attendance (
  id              uuid primary key default uuid_generate_v4(),
  service_id      uuid not null references services(id) on delete cascade,
  member_id       uuid not null references members(id) on delete cascade,
  status          text not null check (status in ('present','absent','excused')),
  marked_by       uuid references members(id),
  marked_at       timestamptz not null default now(),
  unique (service_id, member_id)
);

-- Duty Roles
create table duty_roles (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  department      text,
  description     text
);

-- Duty Assignments
create table duty_assignments (
  id              uuid primary key default uuid_generate_v4(),
  service_id      uuid not null references services(id) on delete cascade,
  member_id       uuid not null references members(id) on delete cascade,
  duty_role_id    uuid not null references duty_roles(id),
  status          text not null default 'assigned'
                  check (status in ('assigned','confirmed','reminded','swapped','declined')),
  assigned_by     uuid references members(id),
  notified_at     timestamptz,
  created_at      timestamptz not null default now()
);

-- Events
create table events (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text,
  event_date      date not null,
  event_time      time,
  event_type      text not null check (event_type in ('announcement','program','outreach','special')),
  location        text,
  is_published    boolean not null default false,
  created_by      uuid references members(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Notification Log
create table notification_log (
  id              uuid primary key default uuid_generate_v4(),
  member_id       uuid references members(id),
  notification_type text not null,
  payload         jsonb,
  status          text default 'sent',
  sent_at         timestamptz default now()
);

-- Row Level Security
alter table members          enable row level security;
alter table services         enable row level security;
alter table attendance       enable row level security;
alter table duty_assignments enable row level security;
alter table events           enable row level security;

-- RLS Policies (examples)
-- Members: admins/secretaries see all; members see only themselves
create policy "members_select" on members for select
  using (auth.uid() is not null);

create policy "events_select_published" on events for select
  using (is_published = true or exists (
    select 1 from members where auth_user_id = auth.uid() and role in ('admin','secretary')
  ));
```

---

## 15. Routing & Access Control

### Route Structure

```typescript
// src/App.tsx
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,   // checks auth session
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true,               element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard',         element: <DashboardPage /> },
          { path: 'attendance',        element: <RoleGuard roles={['admin','secretary']}><AttendancePage /></RoleGuard> },
          { path: 'attendance/:id',    element: <RoleGuard roles={['admin','secretary']}><AttendanceDetailPage /></RoleGuard> },
          { path: 'roster',            element: <RoleGuard roles={['admin','secretary']}><RosterPage /></RoleGuard> },
          { path: 'events',            element: <EventsPage /> },
          { path: 'events/:id',        element: <EventDetailPage /> },
          { path: 'members',           element: <RoleGuard roles={['admin','secretary']}><MembersPage /></RoleGuard> },
          { path: 'members/:id',       element: <RoleGuard roles={['admin','secretary']}><MemberDetailPage /></RoleGuard> },
          { path: 'services',          element: <RoleGuard roles={['admin','secretary']}><ServicesPage /></RoleGuard> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
```

### `ProtectedRoute` Component

```typescript
// Checks useAuth().session
// If isLoading: shows full-screen spinner
// If no session: redirects to /login, preserving attempted URL in state
// If session: renders <Outlet />
```

### `RoleGuard` Component

```typescript
interface RoleGuardProps {
  roles: MemberRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;   // optional — defaults to redirect to /dashboard
}
```

Checks `useRole().role` against the allowed `roles` array. If unauthorised, shows the fallback or redirects.

### Code Splitting

Each module's page is lazy-loaded:
```typescript
const DashboardPage     = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const AttendancePage    = lazy(() => import('@/modules/attendance/pages/AttendancePage'));
// ...

// Wrapped in Suspense with a page-level skeleton loader
<Suspense fallback={<PageSkeleton />}>
  <Outlet />
</Suspense>
```

---

## 16. PWA & Offline Strategy

### Service Worker

Configured via `vite-plugin-pwa` with Workbox. Strategies:

| Resource | Strategy | Rationale |
|---|---|---|
| App shell (HTML/JS/CSS) | Cache First | Static assets never change between deploys |
| Supabase API calls | Network First (4s timeout) | Prioritise fresh data, fall back to cache |
| Images | Cache First (30 days) | Member photos don't change often |

### Offline Attendance Flow (detailed)

1. Secretary opens attendance page offline (app shell served from cache)
2. Member list is served from React Query's in-memory cache (if populated earlier)
3. Marks are stored as `PendingAttendanceChange[]` in `localStorage`
4. A banner is shown: "You're offline. Changes will sync when reconnected."
5. `window.addEventListener('online', ...)` triggers the sync function
6. Sync function processes pending changes sequentially with Supabase
7. On success: clears localStorage, shows "X changes synced" toast
8. On partial failure: logs which records failed; retries on next online event

### Install Prompt

Show a custom install banner (not the default browser UI) after user's third session:
- "Install the Secretariat app for offline access and quick launch"
- "Install" button + "Not now" dismiss
- Store dismiss in `localStorage`; don't show again for 14 days

---

## 17. Responsiveness Strategy

### Breakpoints

| Name | Width | Layout |
|---|---|---|
| Mobile | < 768px | Single column, bottom nav, full-width cards, stacked controls |
| Tablet | 768px – 1023px | Two columns where possible, collapsed icon sidebar |
| Desktop | ≥ 1024px | Full sidebar, multi-column grids, data tables |

### Mobile-First Approach

Every CSS Module is written mobile-first. Desktop enhancements are added with `min-width` media queries:

```css
/* Mobile default */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
}

/* Desktop enhancement */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
}
```

### Touch UX Rules

- All interactive elements: minimum 44×44px touch target (apply `min-height: 44px; min-width: 44px`)
- No `hover`-only states for critical functionality
- Swipe-to-dismiss on toasts on mobile (use `touchstart`/`touchend` listeners)
- Avoid double-tap zoom: set `touch-action: manipulation` on buttons
- Form inputs trigger correct keyboard: `type="email"`, `type="tel"`, `inputMode="numeric"` where appropriate

### Data Table Responsiveness

On mobile, data tables transform into card lists:

```typescript
// Pattern used in MembersPage, AttendancePage
const breakpoint = useBreakpoint();

return breakpoint === 'mobile'
  ? <MemberCardList members={members} />
  : <MemberTable members={members} />;
```

The `MemberTable` is never shown on mobile — it would require horizontal scrolling, which is poor UX. `MemberCardList` renders the same data as stacked cards.

### Typography Scaling

```css
/* Headings reduce on mobile */
.pageTitle {
  font-size: var(--text-xl);
}

@media (min-width: 768px) {
  .pageTitle { font-size: var(--text-2xl); }
}

@media (min-width: 1024px) {
  .pageTitle { font-size: var(--text-3xl); }
}
```

---

## 18. Web Best Practices Checklist

### Accessibility (a11y)

- All images have `alt` attributes; decorative images have `alt=""`
- All interactive elements are keyboard-navigable (`Tab`, `Enter`, `Escape`)
- Modals trap focus using `focus-trap` pattern; restore focus on close
- Form inputs always have associated `<label>` elements (even if visually hidden)
- Colour is never the only means of conveying information (status badges include text, not just colour)
- `aria-live="polite"` on attendance summary to announce count changes to screen readers
- `role="status"` on toast container
- All icon-only buttons have `aria-label`
- Skip-to-main-content link at top of page (visually hidden, visible on focus)

### Performance

- Code split by route (React `lazy` + `Suspense`)
- Images served as WebP with `srcset` for responsive sizes
- `loading="lazy"` on images below the fold
- `React.memo` on expensive list items (MemberCard, EventCard, DutyCard) to prevent unnecessary re-renders
- `useCallback` / `useMemo` used judiciously on handlers passed to list children
- `staleTime` configured per-query in React Query to reduce redundant network requests
- Avoid layout thrash: batch DOM reads/writes; use CSS transforms for animations
- Font display: use system fonts (no web font requests); Georgia and Trebuchet MS are preinstalled on all major platforms

### Security

- All environment variables prefixed `VITE_` (not secrets — public anon key only)
- All DB access gated by Supabase Row Level Security
- No sensitive data stored in `localStorage` (only non-sensitive pending changes and UI preferences)
- Input sanitisation via Zod on all user inputs before submission
- CORS handled by Supabase; no custom proxy needed
- `Content-Security-Policy` header set at deployment (Vercel `vercel.json`)

### SEO & Meta

Though this is an authenticated internal tool, set basic meta:
```html
<!-- index.html -->
<meta name="description" content="Church Secretariat — digital operations platform" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#1c1a17" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### Error Handling

- Every `useQuery` and `useMutation` handles `error` states explicitly — never silently swallows errors
- Network errors show an `ErrorBoundary` with a retry button
- Form submission errors shown inline (field-level) and/or as a toast
- Supabase RPC errors mapped to user-friendly messages (e.g. `23505` unique violation → "This member is already assigned to this role")
- A global `ErrorBoundary` at the `App` level catches unexpected render errors

### Code Quality

- `strict: true` in `tsconfig.json` — no implicit `any`
- No `as` type assertions except where unavoidable (e.g. environment variables)
- All exported components have explicit return type: `ReactElement` or `ReactElement | null`
- Props interfaces documented with JSDoc comments for non-obvious props
- No inline styles (except dynamic values like bar chart heights) — all styling via CSS Modules
- Consistent naming: `PascalCase` for components/types, `camelCase` for functions/variables, `kebab-case` for CSS class names (CSS Modules auto-scope)
- `index.ts` barrel files in each module for clean imports

### Environment Configuration

```bash
# .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME="Church Secretariat"
VITE_WHATSAPP_ENABLED=false
```

---

## Phase 1 Build Order

Start with these in sequence — each depends on the previous:

1. **Project scaffold** — Vite setup, tokens, reset, globals CSS
2. **Auth module** — Login page, `useAuth`, `useRole`, route protection
3. **App Shell** — Sidebar, TopBar, MobileNav (all breakpoints)
4. **Shared components** — Button, Input, Select, Modal, Badge, Avatar, StatCard, Spinner, Toast
5. **Members module** — Registry and form (needed by all other modules)
6. **Services module** — Service creation (dependency for Attendance and Roster)
7. **Attendance module** — Roll call page (the most used screen in Phase 1)
8. **Duty Roster module** — Assignment and notification
9. **Dashboard module** — Aggregates data from all above modules
10. **Events module** — Announcements and publishing

---

*Document version 1.0 — Generated for Kufre's congregation secretariat PWA project*  
*Design system: #1c1a17 · #e8c84a · Georgia/Trebuchet MS*
