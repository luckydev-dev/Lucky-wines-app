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
