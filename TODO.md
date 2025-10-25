# TODO: Implement Cookies in Koneti Cafe

## Backend Changes
- [x] Install cookie-parser
- [x] Update server.js with cookie-parser middleware and CORS credentials
- [x] Add /me and /logout routes in adminRoutes.js
- [x] Add getMe and logout functions in adminController.js

## Frontend Changes
- [x] Update Header.jsx to check auth via /admin/me instead of sessionStorage
- [x] Update AdminPage.jsx logout to call /admin/logout
- [x] Create CookieConsent.jsx component
- [x] Create CookieConsent.scss styles
- [x] Add CookieConsent to App.jsx

## Testing
- [ ] Test login flow - cookie should be set, admin link should appear
- [ ] Test logout flow - cookie should be cleared, admin link should disappear
- [ ] Test cookie consent banner - should appear once, then stay hidden
- [ ] Test protected routes still work with cookie auth
