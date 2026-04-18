# mailadmin panel — UI/UX Improvement Plan

## Sprint 1: Dark Theme Infrastructure
- [x] 1.1 Create semantic CSS custom properties (design tokens) for light and dark ✅
- [x] 1.2 Create `useTheme` hook (localStorage + prefers-color-scheme + html class sync) ✅
- [x] 1.3 Create ThemeProvider client component to wrap the app ✅
- [x] 1.4 Add theme toggle button in the sidebar ✅
- [x] 1.5 Convert `globals.css` to use semantic tokens ✅
- [x] 1.6 Convert `app-shell.tsx` sidebar + main to use tokens ✅
- [x] 1.7 Convert `ui.tsx` components (Surface, StatCard, Field, TextInput, SelectInput, etc.) ✅
- [x] 1.8 Convert `form-submit-button.tsx` to use tokens ✅
- [x] 1.9 Convert `password-input.tsx` to use tokens ✅
- [x] 1.10 Convert `confirm-delete-action.tsx` modal to use tokens ✅
- [x] 1.11 Convert `edit-mailbox-action.tsx` modal to use tokens ✅
- [x] 1.12 Convert `page-toast.tsx` to use tokens ✅
- [x] 1.13 Convert login page to use tokens ✅
- [x] 1.14 Convert dashboard overview page to use tokens ✅
- [x] 1.15 Convert domains page to use tokens ✅
- [x] 1.16 Convert mailboxes page to use tokens ✅
- [x] 1.17 Convert aliases page to use tokens ✅
- [x] 1.18 Convert sender-acl page to use tokens ✅
- [x] 1.19 Convert settings page to use tokens ✅
- [x] 1.20 Remove duplicate background gradient (globals.css vs app-shell.tsx) ✅

## Sprint 2: Mobile Navigation
- [x] 2.1 Create mobile header bar with hamburger button (visible < lg) ✅
- [x] 2.2 Create off-canvas drawer component with overlay ✅
- [x] 2.3 Integrate drawer into AppShell, hide sidebar on mobile ✅
- [x] 2.4 Add close-on-navigation behavior (pathname change closes drawer) ✅

## Sprint 3: Sidebar Sticky + Session Repositioning
- [x] 3.1 Make sidebar sticky on desktop with overflow scroll ✅
- [x] 3.2 Move session/user block to top of sidebar (below logo) ✅

## Sprint 4: Modal Accessibility (WCAG)
- [x] 4.1 Add role="dialog", aria-modal, aria-labelledby to ConfirmDeleteAction ✅
- [x] 4.2 Add focus trap to ConfirmDeleteAction ✅
- [x] 4.3 Add Escape key handler to ConfirmDeleteAction ✅
- [x] 4.4 Add role="dialog", aria-modal, aria-labelledby to EditMailboxAction ✅
- [x] 4.5 Add focus trap to EditMailboxAction ✅
- [x] 4.6 Add Escape key handler to EditMailboxAction ✅

## Sprint 5: Table UX Improvements
- [x] 5.1 Consolidate mailbox actions (Settings/Password/Delete) into single Actions column ✅
- [x] 5.2 Add zebra striping to all tables via data-striped attribute + CSS ✅
- [x] 5.3 Improve table header contrast (font-semibold already applied) ✅
- [x] 5.4 Make delete buttons ghost/outline (btn-ghost-danger), red only on hover ✅

## Sprint 6: Loading, Empty States, Pagination
- [x] 6.1 Create EmptyState component with icon + text + CTA ✅
- [x] 6.2 Replace plain empty messages with EmptyState in all tables ✅
- [x] 6.3 Implement ellipsis pagination pattern (max 7 visible buttons) ✅
- [x] 6.4 Create loading.tsx skeleton for the dashboard layout ✅

## Sprint 7: Visual Polish
- [x] 7.1 Add breadcrumb component to replace eyebrow text ✅
- [x] 7.2 Integrate breadcrumb into all pages ✅
