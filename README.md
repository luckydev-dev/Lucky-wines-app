# Lucky Wine & Liquor - two Android apps, one repo

| App | Folder | Package |
|---|---|---|
| Customer app | `users/` | `com.wine.lucky` |
| Admin / store manager | `admin/` | `wine.admin.lucky` |
| Shared code (theme, icons, components, Firebase) | `shared/` | - |

React + TypeScript + Vite, wrapped with Capacitor. Live data from Firebase Realtime Database.

## 1. Firebase (once)
Follow [`firebase/SETUP.md`](firebase/SETUP.md): enable Anonymous + Email/Password sign-in, create the admin user, publish `firebase/database.rules.json`, import `firebase/seed-data.json`.

## 2. Build APKs on GitHub (recommended)
`.github/workflows/build-apks.yml` builds **both** signed release APKs and uploads them to Gofile.io.
It runs on every push to `main`, or manually: **Actions -> Build APKs and upload to Gofile -> Run workflow**.
The download links appear in the run's **Summary** (the APKs are also kept as a workflow artifact for 14 days).

### Signing key (do this once, then keep it forever)
An app can only be updated by an APK signed with the **same key**. Create one key per app on your computer:

```bash
keytool -genkeypair -keystore users-release.keystore -alias users-release-key -keyalg RSA -keysize 2048 -validity 10000 -storepass YOURPASS -keypass YOURPASS
keytool -genkeypair -keystore admin-release.keystore -alias admin-release-key -keyalg RSA -keysize 2048 -validity 10000 -storepass YOURPASS2 -keypass YOURPASS2
base64 -w0 users-release.keystore    # copy the output
base64 -w0 admin-release.keystore
```
Use the same password for the store and the key, and keep the aliases exactly as above.
**Back the `.keystore` files up somewhere safe (not in git).**

In GitHub: **Settings -> Secrets and variables -> Actions -> New repository secret**

| Secret | Value |
|---|---|
| `USERS_KEYSTORE_BASE64` | base64 of `users-release.keystore` |
| `USERS_KEYSTORE_PASSWORD` | its password |
| `ADMIN_KEYSTORE_BASE64` | base64 of `admin-release.keystore` |
| `ADMIN_KEYSTORE_PASSWORD` | its password |
| `GOFILE_TOKEN` *(optional)* | your Gofile account token, so uploads go to your account |

Without the keystore secrets the workflow still builds, but signs with a **temporary key** (it warns in the summary) - those APKs cannot update an app installed from a different key.

## 3. Build locally
Needs JDK 17 and the Android SDK.
```bash
npm ci
./scripts/build-and-upload.sh <label> <versionName>   # e.g. ./scripts/build-and-upload.sh step10 1.0.9
```
Builds both release APKs into `build-apks/` and uploads them with `scripts/upload-gofile.sh`.
Keystores and passwords are created in the git-ignored `keystores/` folder - back that folder up.

## Dev
```bash
npm run build:users   # or build:admin / build:all
```

## Status against the original brief

**Built:** custom (non-Material) theme + SVG icon set, live catalog from Realtime Database, customer app with
age gate, cart, checkout, COD, UPI deep links + QR + "I have paid", live order tracking; admin app with login,
live orders (sound/vibration alert while the app is open), status changes, UPI verification, product /
stock / banner / store-settings editing; hardened database rules; GitHub Actions build + Gofile upload.

**Not built yet:**
- Phone OTP login for customers (customers are signed in anonymously for now; no saved profile or address book)
- Admin push notifications when the app is closed (needs FCM device registration + a Cloud Function on the Blaze plan);
  today the admin alert only works while the app is open
- Admin dashboard charts, customers list, categories manager, bulk edit, "My devices" screen
- Image upload with compression (product images are URLs), product detail page / filters / sorting
- Release minify + resource shrinking (left off so the untested build cannot break at runtime)
- Server-side order total check (needs a Cloud Function; see `firebase/SETUP.md`)
