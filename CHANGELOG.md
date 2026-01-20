# Changelog

All notable changes to the ToraShaout project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

#### Admin Talent Management Pagination & UI Enhancements (2026-01-20)
- **Pagination System**
  - Reusable Pagination component with page numbers, navigation, and item counts
  - Server-side pagination for getPendingTalents, getRejectedTalents, and getActiveTalents
  - Page size set to 10 items per page
  - Smart page number display with ellipsis (e.g., 1 ... 5 6 7 ... 20)
  - "Showing X to Y of Z results" indicator
  - Previous/Next button navigation with disabled states
  - Automatic reset to page 1 when filters or search change
- **UI Improvements**
  - iOS-style toggle switches for booking acceptance status (green/gray)
  - Custom confirmation modals replacing browser confirm() prompts
  - Toast notifications for success/error feedback
  - Review Details modal for pending/rejected talents
  - Active Talent Details modal with performance stats
  - Dynamic category loading from database
  - Scale-in animation for modals
- **Database Seeding Scripts**
  - `seed-talents.mjs` - Generate test talents (pending, approved, rejected)
  - `count-talents.mjs` - Check current talent counts and pagination info
  - `add-more-rejected.mjs` - Add additional rejected talents for testing
  - Realistic Zimbabwean names and varied talent categories

#### Admin Talent Management System (2026-01-20)
- **Three-Status Verification Workflow**
  - Pending status for talents awaiting review
  - Approved status for verified talents accepting bookings
  - Rejected status with re-approval capability
  - Database enum type `verification_status` with indexed column
- **Admin Dashboard Enhancements**
  - Collapsible sections: Pending Verifications, Active Talents, Rejected Applications
  - Real-time badge count updates across all sections
  - Color-coded status indicators (yellow/green/red)
  - Confirmation dialogs for all admin actions
- **ActiveTalentsList Component** (`components/admin/ActiveTalentsList.tsx`)
  - Search by name or bio
  - Filter by category (musician, comedian, actor, etc.)
  - Toggle booking acceptance status
  - Real-time stats display (bookings, ratings, pricing)
  - Auto-refresh on talent approval using React key prop pattern
- **Admin API Client** (`lib/api/admin.client.ts`)
  - `getPendingTalents()` - Fetch talents with pending/null status
  - `getRejectedTalents()` - Fetch rejected applications
  - `approveTalent()` - Approve and enable bookings
  - `rejectTalent()` - Reject and disable bookings
  - `reapproveTalent()` - Re-approve rejected talents
  - `getActiveTalents()` - Fetch verified talents with filters
  - `toggleTalentAcceptingBookings()` - Toggle booking status
- **Admin Dashboard Hook** (`lib/hooks/useAdminDashboard.ts`)
  - Rejected talents state management
  - Multi-list refresh pattern with Promise.all
  - 100ms delay for database consistency
  - Centralized error handling
- **Database Migration** (`supabase/migrations/add_verification_status.sql`)
  - Idempotent enum type creation
  - Idempotent column addition with error handling
  - Automatic data migration from `admin_verified` field
  - Performance index on `verification_status`

#### Documentation Workflow System
- **Documentation Workflow System**
  - Pre-push git hook (`.git/hooks/pre-push`) to verify documentation updates
  - [DOCUMENTATION_WORKFLOW.md](./DOCUMENTATION_WORKFLOW.md) - Complete documentation workflow guide
  - Pre-push checklist verification before every push
  - Documentation templates and examples
  - Version numbering guidelines (Semantic Versioning)
- **README.md Documentation Section** - Comprehensive documentation index
- CHANGELOG.md file for tracking project changes

### Changed

#### Admin Dashboard
- **Talent Management Tab** - Complete UI overhaul with three-section layout
- **Database Schema** - Added `verification_status` column to `talent_profiles`
- **Query Optimization** - Backwards-compatible queries with `.or()` for null values

### Improved
- **Performance** - Pagination reduces initial load time and memory usage for large datasets
- **User Experience** - Clear pagination controls and item counts for better navigation
- **Database Efficiency** - Only loads one page of data at a time instead of all records
- **Database Consistency** - 100ms delay pattern after mutations before querying
- **UI Responsiveness** - All talent lists auto-refresh after admin actions
- **Query Performance** - Indexed `verification_status` column for fast filtering
- **Error Handling** - Graceful fallbacks for missing columns
- **Type Safety** - Fixed TypeScript type inference errors in admin API functions

### Technical Details

#### Talent Management Statistics
- **Files Changed:** 5
- **New Components:** 1 (ActiveTalentsList)
- **New API Functions:** 7
- **Database Migrations:** 1
- **Lines Added:** +1,813
- **Lines Removed:** -139
- **Net Change:** +1,674

#### Key Technical Patterns
- React key prop for forced component remount
- Promise.all for parallel data fetching
- 100ms delay for eventual consistency handling
- Idempotent migrations with DO blocks
- Backwards-compatible database queries

---

## [0.2.0] - 2026-01-20

### Added

#### New Components
- **AuthGuard** (`components/AuthGuard.tsx`) - Authentication wrapper component for protected routes with session verification and loading states
- **Providers** (`components/Providers.tsx`) - Global provider wrapper for app-wide context management
- **Skeleton** (`components/ui/Skeleton.tsx`) - Reusable skeleton loading component with multiple variants and shimmer animation
- **Toast** (`components/ui/Toast.tsx`) - Toast notification component with auto-dismiss, multiple variants, and queuing system

#### New Custom Hooks
- **useCustomerDashboard** (`lib/hooks/useCustomerDashboard.ts`) - Manages customer dashboard state, data fetching, and real-time synchronization
- **useTalentProfile** (`lib/hooks/useTalentProfile.ts`) - Manages talent dashboard state, booking requests, and earnings

#### New API Modules
- **notifications.client.ts** (`lib/api/notifications.client.ts`) - Client-side notification API functions with real-time subscriptions
- **notifications.server.ts** (`lib/api/notifications.server.ts`) - Server-side notification API functions with bulk operations

### Changed

#### Major Refactors
- **customer-dashboard/page.tsx** - Migrated to use `useCustomerDashboard` hook with improved state management
- **dashboard/page.tsx** - Migrated to use `useTalentProfile` hook with better real-time updates
- **admin/page.tsx** - Added AuthGuard protection and improved admin role verification

#### Authentication Pages
- **login/page.tsx** - Added toast notifications and improved form validation
- **signup/page.tsx** - Enhanced error messaging and added success notifications
- **forgot-password/page.tsx** - Added toast feedback and better email validation
- **reset-password/page.tsx** - Enhanced password reset flow with notifications

#### Navigation & Layout
- **Navbar.tsx** - Integrated AuthGuard, improved user menu, and added logout functionality
- **AuthNavbar.tsx** - Enhanced authentication state handling and user profile display
- **layout.tsx** - Wrapped with Providers component for enhanced global state management
- **globals.css** - Added skeleton shimmer animations, toast notification styles, and loading state utilities

### Refactored
- **notifications.ts** - Split into separate client and server modules (removed 287 lines)
  - Better separation of concerns
  - Improved tree-shaking for smaller bundles
  - Enhanced security with proper client/server boundaries

### Improved
- **Architecture** - Custom hooks centralize business logic, cleaner component structure
- **UX** - Skeleton loading states, toast notifications, smoother transitions
- **Security** - AuthGuard for route protection, better client/server API boundaries
- **Code Quality** - Reduced duplication, better TypeScript type safety
- **Performance** - Optimized bundle size, better tree-shaking, reduced re-renders

### Migration Notes
- Import notifications from `notifications.client.ts` in client components
- Import notifications from `notifications.server.ts` in server components
- Use `useCustomerDashboard()` in customer-facing components
- Use `useTalentProfile()` in talent dashboard components
- Wrap protected routes with `<AuthGuard>`

### Statistics
- **Files Changed:** 20
- **Lines Added:** +2,156
- **Lines Removed:** -1,036
- **Net Change:** +1,120
- **New Components:** 4
- **New Hooks:** 2
- **New API Modules:** 2
- **Pages Refactored:** 7

---

## [0.1.5] - 2026-01-15

### Added
- **Customer/Fan Dashboard** (`/customer-dashboard`) with 4-tab interface
  - Overview tab with stats, recent bookings, and favorites
  - My Bookings tab with filtering and status tracking
  - Favorites tab with saved talent list
  - Settings tab for profile and notifications
- **Admin Panel** (`/admin`) with 5-tab interface
  - Overview tab with platform metrics and revenue charts
  - Talent Management for verification workflow
  - Bookings management with export functionality
  - Moderation queue for flagged content
  - Analytics for user growth and category performance
- **Real-time Notification System**
  - NotificationCenter component with dropdown panel
  - LiveNotificationBadge with animated unread count
  - NotificationToast for pop-up notifications
  - 9 notification types supported
  - Mock notifications for demo

### Enhanced
- **Talent Dashboard** (`/dashboard`) - Complete with requests, earnings, and settings

### Documentation
- Created ENHANCEMENTS.md with detailed feature documentation
- Updated README.md with new pages and statistics

### Statistics
- **Pages Added:** 3
- **Dashboard Types:** 3 (Talent, Customer, Admin)
- **Components Added:** 2
- **Lines of Code Added:** ~3,000
- **Notification Types:** 9

---

## [0.1.0] - 2026-01-10

### Added
- **Supabase Backend Integration**
  - Complete database schema with 7 tables
  - Row Level Security (RLS) policies
  - Authentication system setup
  - File storage configuration
- **API Functions**
  - Talents API (`lib/api/talents.ts`)
  - Bookings API (`lib/api/bookings.ts`)
  - Users API (`lib/api/users.ts`)
  - Favorites API (`lib/api/favorites.ts`)
  - Notifications API (`lib/api/notifications.ts`)
  - Admin API (`lib/api/admin.ts`)
- **Supabase Client Utilities**
  - Client-side client (`lib/supabase/client.ts`)
  - Server-side client (`lib/supabase/server.ts`)
  - Admin client with RLS bypass
- **Authentication Pages**
  - Login page (`/login`)
  - Signup page (`/signup`)
  - Forgot Password page (`/forgot-password`)
  - Reset Password page (`/reset-password`)

### Documentation
- Created docs/BACKEND_README.md
- Created docs/SUPABASE_SETUP.md
- Created docs/AUTHENTICATION_GUIDE.md

---

## [0.0.1] - 2026-01-05

### Added
- Initial project setup with Next.js 14
- TypeScript configuration
- Tailwind CSS setup
- Basic page structure
  - Homepage (`/`)
  - Browse page (`/browse`)
  - About page (`/about`)
  - Contact page (`/contact`)
  - How It Works page (`/how-it-works`)
  - Join page (`/join`)
  - Privacy page (`/privacy`)
  - Terms page (`/terms`)
- Basic components
  - Navbar
  - Footer
  - Hero section
- Project documentation
  - README.md
  - DEPLOYMENT.md
  - QUICKSTART.md
  - PROJECT_SUMMARY.md

---

[Unreleased]: https://github.com/staticB1/torashaout/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/staticB1/torashaout/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/staticB1/torashaout/compare/v0.1.0...v0.1.5
[0.1.0]: https://github.com/staticB1/torashaout/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/staticB1/torashaout/releases/tag/v0.0.1
