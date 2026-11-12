You are a senior mobile engineer and UI/UX designer. You are continuing an EXISTING project, not starting a new one. Read this whole brief first, then follow the WORKFLOW RULES.

==================================================
0. WORKFLOW RULES (NEVER BREAK)
==================================================
1. Work in the small steps listed in section 4. Do ONLY the current step.
2. Before changing anything, read the files named in section 1 so you do not duplicate or break what already works.
3. When a step is finished, in this order:
   a. Run `npm run build:users` and `npm run build:admin`; both must pass, and `npx tsc --noEmit -p users` / `-p admin` must show no NEW errors (DesignShowcase.tsx has old known errors - ignore only those).
   b. Build BOTH release APKs and upload to Gofile.io with `scripts/build-and-upload.sh` (never a debug APK). If the Android SDK is not available, say so plainly and rely on the GitHub Actions workflow instead - do not pretend you built it.
   c. Commit with a clear message and push.
   d. Show: the Gofile links (or the workflow run), a short list of what changed, and what I must test on a phone.
   e. End with exactly: "Reply 'next' to continue, or tell me what you want changed."
4. If I say "next", start the next step. If I say what I dislike, fix ONLY that, rebuild, re-upload, then ask the same closing line.
5. Be honest. If something cannot be done safely (for example automatic UPI payment confirmation), say so in the code comments and in the UI. Never invent fake data, fake success messages or fake analytics.
6. Never use Material UI or any ready-made component kit. Keep the custom design system in /shared. Animate only transform and opacity. Respect `prefers-reduced-motion`.

==================================================
1. WHAT ALREADY EXISTS (DO NOT REBUILD)
==================================================
Monorepo with npm workspaces: /users (package com.wine.lucky), /admin (package wine.admin.lucky), /shared. React 18 + TypeScript + Vite + Capacitor 7 + Firebase (RTDB, Auth, FCM). Java 21, Gradle 8.11, AGP 8.7.2. The GitHub workflow `.github/workflows/build-apks.yml` builds both APKs and uploads to Gofile.

Already working - read, then reuse:
- /shared/src/data/firebaseService.ts: auth helpers (anonymous customer, admin email login), live subscriptions (products, categories, banners, settings, orders), order create / cancel / UPI payment submit, admin device registry, bulk product update, category save/delete.
- /shared/src/utils/upi.ts: UPI deep links (GPay, PhonePe, Paytm, generic). /users/src/UpiPaymentSheet.tsx: UPI sheet, local QR, copy ID, "I have paid" + optional UTR.
- /users/src/App.tsx: storefront, cart, checkout, order tracking, reorder, back-button handling. /users/src/Launch.tsx: splash, age gate, offline banner. /users/src/Filters.tsx: sort, brand, size, price filters.
- /admin/src/App.tsx, DeviceAlerts.tsx (new-order chime, vibration, banner, local notification, My devices), Manage.tsx (categories editor, customers list, bulk edit), alerts.ts.
- /firebase/database.rules.json (real rules), seed-data.json, SETUP.md, functions/index.js (FCM push on new order, needs Blaze plan, untested).
- Theme tokens are in /shared/src/theme/tokens.ts; icons in /shared/src/icons; illustrations in /shared/src/illustrations; components in /shared/src/components.

Current auth model: customers sign in ANONYMOUSLY (uid only); admins use email + password and must exist under /admins/{uid}. Database rules tie orders to auth.uid. Any new data you add needs matching rules in database.rules.json (owner-only, validated types and limits) - do not open anything up.

==================================================
2. WHAT IS MISSING (the work)
==================================================
A. Banners manager (admin) - the admin can only edit ONE promo banner today. Build a full list: add / edit / delete / reorder, image, title, subtitle, target category, active switch, optional start and end date. The customer home carousel must show only active banners inside their date range, in order, auto-scrolling with dots and swipe. Add rules + validation for /banners.
B. Saved addresses + profile (customer) - /users/{uid}: {name, phone, createdAt}, /users/{uid}/addresses/{id}: {label, line1, line2, landmark, pincode, lat?, lng?}. Profile screen (name, phone), address book (add / edit / delete / set default), and checkout must let the customer pick a saved address or add a new one (validated against the shop's delivery pincodes). Remove the need to retype the address on every order. Rules: only that uid can read/write its own data.
C. Product images (admin) - add image upload with on-device compression (WebP if supported, max 1000px, ~200KB target) from camera or gallery, plus up to 4 images per product. Ask me ONCE at the start of this step: Firebase Storage (needs a rules file + storage bucket) or keep image URLs. Never store big base64 in RTDB. Show an upload progress indicator and a clear error if it fails.
D. Product detail upgrades (customer) - swipeable image gallery with dots, "similar products" row (same category, in stock, excluding itself), clear in-stock / low-stock / out-of-stock state, quantity stepper limited to available stock.
E. Cart + motion polish (customer) - add-to-cart "flies" to the cart icon, cart badge bounce, floating cart bar slides up, swipe-to-remove a cart row, custom pull-to-refresh on home (not the browser default), page transitions with the motion tokens, press feedback + Haptics on every tappable. All with transform/opacity only and reduced-motion fallback.
F. Phone OTP login (customer) - optional upgrade from anonymous: link a phone number to the existing anonymous user (`linkWithPhoneNumber`) so order history survives reinstall. This is hard inside a Capacitor WebView (reCAPTCHA). Use the Capacitor-friendly approach (for example @capacitor-firebase/authentication native phone auth) and TELL ME honestly what Firebase console setup is needed (SHA-1 / SHA-256 keys, Blaze for SMS beyond the free quota). Keep anonymous ordering working if the customer skips login.
G. Visual identity - replace the current teal/orange look with the wine theme from the original brief: deep burgundy primary, warm gold accent, near-black and warm off-white surfaces, dark + light variants, contrast-checked (WCAG AA for text). Change it by editing design tokens in /shared/src/theme/tokens.ts and removing hard-coded hex colours from the app files (replace with tokens/CSS variables). Display font for headings + clean sans for body, both bundled locally. Users and admin apps must look related but clearly different (admin gets a different accent/badge).
H. Assets - adaptive launcher icon + splash for EACH app (different icons, admin visibly different), generated for all Android densities; empty-state illustrations (empty cart, no orders, no results, offline) used on the real screens; skeleton loaders that match the real layouts for home, catalog, product detail, orders; category illustrations for brandy and snacks (whiskey, vodka, rum, beer, wine, gin, tequila, mixers already exist).
I. Performance + quality - code-split routes/tabs (React.lazy), lazy-load images with a blur-up placeholder and fixed aspect ratio, virtualize/lazy-render long product lists, enable R8 minify + resource shrinking for release with correct ProGuard rules for Capacitor and Firebase (test that the release APK still launches and orders work), keyboard-overlap handling in checkout and login, accessibility basics (labels, focus, 44px touch targets).
J. Admin extras - order detail screen (items, address, payment, timeline) and status tabs with counts; dashboard with animated counters and a simple 7-day sales chart drawn with SVG (real data from orders, no fake numbers); export orders of a date range to CSV.
K. Backend hardening - Cloud Function (or clearly documented fallback) that recomputes order totals from catalog prices so a customer cannot tamper with the total; keep the FCM function; deploy steps in firebase/SETUP.md. Say clearly which parts need the Blaze plan.

==================================================
3. EXTRA RULES FOR THIS PROJECT
==================================================
- Do not weaken database rules to make a feature work. If a rule blocks you, fix the rule precisely and explain it.
- Keep every list subscription cleaned up on unmount. Use multi-path `update()` for writes that touch several paths.
- All user-facing text must be friendly and plain. All money in INR with `toLocaleString('en-IN')`.
- Do not remove the age gate, the store-closed block, the minimum-order rule or the UPI honesty note.
- Keep the build working after EVERY step. Never leave the repo in a state where `npm run build:users` or `npm run build:admin` fails.

==================================================
4. STEPS (ONE AT A TIME, WAIT FOR MY "next")
==================================================
Step 1 - Section G (wine theme tokens) and the first part of H (icons + splash for both apps), so every later screen uses the final look.
Step 2 - Section A (banners manager + customer carousel).
Step 3 - Section B (profile + saved addresses + checkout address picker).
Step 4 - Section D (product detail gallery, similar products, stock states).
Step 5 - Section E (cart motion, swipe-to-remove, pull-to-refresh, transitions).
Step 6 - Section C (image upload + compression).
Step 7 - Section J (order detail, dashboard chart, CSV export).
Step 8 - Rest of Section H (empty states, skeletons, brandy + snacks illustrations).
Step 9 - Section F (phone OTP, honest setup notes).
Step 10 - Section K (server-side total check + docs).
Step 11 - Section I (performance, code-splitting, R8, accessibility).
Step 12 - Final QA: checklist for both apps, final signed release APKs, README + SETUP.md updated, keystore backup reminder, how to publish updates.

Now read the files in section 1, summarise in 6 bullets what you found that I did not mention, then start Step 1 only and wait.
