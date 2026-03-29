# COC Odogunyan — Secretariat

A digital operations platform for the Church of Christ, Odogunyan. Built to help the church secretary manage members, attendance, duty rosters, services, and events from a single interface.

---

## Features

- **Dashboard** — attendance trend chart, department attendance breakdown, active/inactive member donut, and a "Who Needs a Visit?" watchlist
- **Members** — member register with search, department/status filtering, table and card grid views
- **Attendance** — service-by-service attendance tracking with per-member marking
- **Duty Roster** — templated duty slots per service type (Sunday has 25 grouped roles; Wednesday/Friday have a single moderator; Fasting and Evangelism are ad-hoc)
- **Services** — service calendar with upcoming and past services
- **Events** — announcements, programs, outreach, and special events with draft/publish flow
- **Role-based access** — Admin, Secretary, and Member roles with guarded routes
- **Light / Dark theme** — toggle with system preference detection and `localStorage` persistence

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Styling | CSS Modules + CSS custom properties |
| Fonts | Playfair Display (headings) · Inter (UI) |
| Auth | Mock (Supabase integration pending) |
| Database | Supabase (integration pending) |

---

## Project Structure

```
src/
├── assets/
│   └── images/          # logo.png (dark), logoLightTheme.png (light)
├── components/
│   ├── layout/          # AppShell, Sidebar, TopBar, MobileNav, PageHeader
│   └── ui/              # Button, Input, Select, Badge, Avatar, Modal, ProgressBar, …
├── context/             # AuthContext, ThemeContext
├── hooks/               # useBreakpoint, useDebounce, useRole
├── lib/                 # toast (lightweight event emitter)
├── modules/
│   ├── auth/            # LoginPage, LoginForm
│   ├── dashboard/       # DashboardPage
│   ├── attendance/      # AttendancePage, AttendanceDetailPage
│   ├── roster/          # RosterPage, AssignmentForm, NewServiceForm
│   ├── services/        # ServicesPage, ServiceForm
│   ├── events/          # EventsPage, EventDetailPage, EventForm
│   └── members/         # MembersPage, MemberForm
├── styles/              # tokens.css, reset.css, typography.css, globals.css
└── types/               # Shared TypeScript types
```

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

**Demo login** (mock auth — any credentials work during UI phase):
- Email: `kufre@coc.org`
- Password: any value

---

## Service Types & Duty Roles

| Service | Duties |
|---|---|
| Sunday Worship | 25 roles across 5 groups (Leadership, Worship & Word, Sacraments, Congregation Support, Classes) |
| Wednesday Prayer | Moderator |
| Friday Bible Study | Moderator |
| Fasting & Prayer | Ad-hoc (defined per session) |
| Evangelism | Ad-hoc (defined per session) |

---

## Roadmap

- [ ] Supabase auth integration
- [ ] Supabase database integration (replace all mock data)
- [ ] WhatsApp duty notifications via Supabase Edge Functions
- [ ] PWA setup (offline support, installable)
- [ ] Member profile page
- [ ] Attendance marking flow (per-member check-in)
