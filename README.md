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
