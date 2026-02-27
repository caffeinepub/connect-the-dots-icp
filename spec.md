# Specification

## Summary
**Goal:** Restrict all content mutation controls (Add, Edit, Delete) to authenticated admins only, making the app read-only for unauthenticated visitors using Internet Identity for auth.

**Planned changes:**
- Hide all Add, Edit, and Delete buttons/dialogs from unauthenticated users across all sections (MissionPage, LatestProgress, EcosystemSpotlight, CybercrimeAwareness, InvestingWisdom, TrustedResources, XPosts, HomePageLinks).
- Show an "Admin Login" button to unauthenticated users so an admin can log in via Internet Identity.
- Show a logout button to authenticated users.
- Use the existing `useInternetIdentity` hook to determine auth state.
- All content remains visible to all visitors regardless of auth state.

**User-visible outcome:** Visitors browsing the live site see all content in read-only mode with no editing controls. Only a logged-in admin (authenticated via Internet Identity) can add, edit, or delete content.
