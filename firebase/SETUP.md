# Firebase setup (required once)

The apps now use Firebase Authentication. Do these in the Firebase Console for project `lucky-wines`.

1. **Authentication -> Sign-in method**
   - Enable **Anonymous** (customer app: each device gets a private user id so it can only read its own orders).
   - Enable **Email/Password** (admin app login).
2. **Create the admin account**
   - Authentication -> Users -> Add user (your email + a strong password). Copy its **User UID**.
3. **Mark that user as admin** (Realtime Database -> Data), add:
   ```
   admins
     <USER UID>
       name:  "Owner"
       email: "you@example.com"
       createdAt: 1700000000000
   ```
   Only users listed under `/admins` can sign in to the admin app. This path cannot be written from the apps.
4. **Deploy the rules**: Realtime Database -> Rules -> paste `firebase/database.rules.json` -> Publish
   (or `firebase deploy --only database`).
5. **Seed the catalog** (first time only): Realtime Database -> Data -> Import JSON -> `firebase/seed-data.json`.

## What the rules enforce
- Customers can create an order only for themselves, starting as `placed` with a `pending` / `awaiting_verification` payment status, and can read only their own orders.
- Each ordered item's `price` must equal the current catalog price.
- Only admins can change order status / payment status, products, categories, banners and settings.

## Known limitation
Realtime Database rules cannot add up an array, so `subtotal` / `total` are only checked for
`total = subtotal + deliveryFee`, not against the items. For full protection against a tampered
total, compute the total in a Cloud Function (needs the Blaze plan).

## New-order push notifications (admin app)
The admin app already rings, vibrates and shows a banner for new orders **while it is open**, and shows a
system notification when it is in the background. For alerts while the app is **fully closed**, add FCM:

1. Firebase Console -> Project settings -> Your apps -> add two Android apps:
   `com.wine.lucky` (customers) and `wine.admin.lucky` (admin). Download each `google-services.json`.
2. Put each file in `users/android/app/` and `admin/android/app/` (local build), **or** add GitHub secrets
   `USERS_GOOGLE_SERVICES_JSON_BASE64` / `ADMIN_GOOGLE_SERVICES_JSON_BASE64` (`base64 -w0 google-services.json`)
   so the workflow writes them before building.
3. Deploy the function (needs the Blaze plan):
   `cd firebase/functions && npm install && cd ../.. && firebase deploy --only functions`
   It sends a push to every phone listed under `admins/<uid>/devices` whenever `/orders/{id}` is created.
   Each admin phone appears in Settings -> **My devices**; removing one signs it out.

The function was written but could not be tested in the build environment - place a test order after deploying.
