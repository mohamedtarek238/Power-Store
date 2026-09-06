# Power Store - Project Context
This file is the verified engineering context for the current repository. It describes the code that exists in `D:\power_store`; backend details are only documented where the frontend currently assumes them.

## Project Overview

Power Store is a React 18 e-commerce storefront with a separate admin area. The customer storefront is a frontend-only experience built around a static product catalog. The admin area is protected by a token stored in browser `localStorage` and communicates with a backend assumed to run at `http://localhost:5000`.

The application currently supports:

- Customer storefront at `/`.
- About page at `/about`.
- Admin login at `/login`.
- Protected admin dashboard at `/admin/dashboard`.
- Admin product management at `/admin/products`.
- Admin orders view at `/admin/orders`.
- English and Arabic localization with RTL support.
- Cart, wishlist, and toast contexts.
- Static storefront product data and backend-backed admin product listing.

There is no backend repository in this workspace, so backend behavior described below is an integration contract inferred from frontend requests rather than verified server implementation.

## Tech Stack

| Area | Current implementation |
| --- | --- |
| UI | React 18.2 with JSX |
| Routing | React Router DOM 6.30 |
| Build tool | Vite 5 |
| Icons | React Icons 4.12 |
| Styling | Custom CSS plus Tailwind CSS v4/PostCSS |
| State | React state and Context API |
| Persistence | Browser `localStorage` |
| HTTP | Native `fetch` |
| Backend URL used by admin | `http://localhost:5000` |
| Backend URL in unused utility | `http://localhost:5001/api` |

Tailwind is imported from the first line of `src/index.css` and is used by `LoginPage.jsx`. The main storefront and admin dashboard also use custom CSS classes.

## Repository Structure

```text
power_store/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── vite.config.js
├── README.md
├── PROJECT_CONTEXT.md
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── test.yaml                 # Empty; no test suite is configured
    ├── components/               # Storefront UI
    ├── context/                  # Cart, wishlist, language, and toast state
    ├── data/products.js          # Static storefront catalog
    ├── locales/                  # English and Arabic dictionaries
    ├── pages/                    # Home, About, and Login pages
    ├── utils/                    # Translation and legacy product API helpers
    └── admin/
        ├── components/            # Layout, route guard, and product table
        ├── data/mockData.js       # Mock admin order data and fallback products
        ├── hooks/useProducts.js   # Admin product GET request
        ├── pages/                 # Dashboard, Products, and Orders
        ├── styles/admin.css       # Admin dashboard styling
        └── utils/                 # Admin token and authenticated fetch helpers
```

## Application Composition

`src/main.jsx` creates the React root, enables `React.StrictMode`, and renders `App`.

`src/App.jsx` mounts providers in this order:

```text
LanguageProvider
└── AppContent
    └── ToastProvider
        └── WishlistProvider
            └── CartProvider
                └── BrowserRouter
                    ├── Header
                    ├── Routes
                    ├── Footer
                    └── Cart
```

The admin routes are rendered inside the same router. The public header, footer, and cart are still mounted around the route content, including on admin pages.

## Routes

| Route | Access | Component | Behavior |
| --- | --- | --- | --- |
| `/` | Public | `HomePage` | Hero, search, category filters, sorting, price filters, product cards, and product detail modal. |
| `/about` | Public | `AboutPage` | Store information, values, features, contact details, and age notice. |
| `/login` | Public | `LoginPage` | Admin username/password login against the backend. Authenticated users redirect to the dashboard. |
| `/admin` | Protected | `AdminLayout` | Redirects to `/admin/dashboard` when authenticated. |
| `/admin/dashboard` | Protected | `AdminDashboard` | Displays product count, mock order count, mock revenue, and a product table. |
| `/admin/products` | Protected | `AdminProducts` | Loads products, creates products, edits products, and locally removes products. |
| `/admin/orders` | Protected | `AdminOrders` | Displays mock orders only. |
| Any other path | Public redirect | `Navigate` | Redirects to `/`. |

`ProtectedAdminRoute` checks only whether `localStorage.adminToken` exists. It does not verify token expiry locally.

## Storefront

### Product data

The customer storefront reads from `src/data/products.js`, not from the backend. Each static product contains:

```js
{
  id,
  name,
  price,
  image,
  category,
  description,
  featured
}
```

Prices are numbers in Egyptian Pounds. Current categories are `Sets`, `Care`, `Wellness`, `Lingerie`, `Accessories`, and `Fragrance`. Images are external Unsplash URLs.

### Home page behavior

`HomePage.jsx` applies filters in this order:

1. Category selection.
2. Search against product name, description, and category.
3. Price range.
4. Sorting.

Sort options are default order, price low-to-high, price high-to-low, name A-to-Z, and name Z-to-A.

The price labels map to these actual EGP ranges:

| UI value | Actual range |
| --- | --- |
| `0-50` | EGP 0 to 2,000 |
| `50-100` | Above EGP 2,000 to 4,000 |
| `100-150` | Above EGP 4,000 to 6,000 |
| `150+` | Above EGP 6,000 |

### Storefront state

- `CartContext` stores cart items, quantities, totals, and sidebar visibility.
- `WishlistContext` stores saved products and wishlist operations.
- `LanguageContext` switches between `en` and `ar`, persists the selection, and updates the document direction.
- `ToastContext` displays temporary success/error messages.
- `AppContent` stores the global product search query.

Cart and wishlist values are persisted under `cart` and `wishlist` in `localStorage`. The selected language is stored under `language`.

### Checkout

`Checkout.jsx` validates full name, email, phone, address, city, and postal code. Card number, cardholder name, expiry, and CVV are additionally validated when card payment is selected.

Checkout is simulated. On successful validation, it shows a success toast, clears the cart after 1.5 seconds, closes the modal, and resets the form. It does not create a real order or send payment information to a server.

## Admin Area

### Authentication

`LoginPage.jsx` sends:

```http
POST http://localhost:5000/api/admin/login
Content-Type: application/json
```

```json
{
  "username": "...",
  "password": "..."
}
```

The response may provide a token under `token`, `jwt`, `accessToken`, or `data.token`. The token is saved as `adminToken` in `localStorage`.

`adminFetch()` adds `Authorization: Bearer <token>` when a token exists. It does not force a `Content-Type`, which is required for browser-generated multipart boundaries.

Logout removes `adminToken` and navigates to `/login`.

### Admin dashboard

`AdminDashboard.jsx` fetches products through `useProducts()` and uses `initialOrders` from `src/admin/data/mockData.js` for order count and revenue. The dashboard metrics are therefore mixed: products are fetched, while orders and revenue are mock values.

### Admin products

`useProducts.jsx` requests:

```http
GET http://localhost:5000/api/products
```

It accepts either a raw array or `{ "products": [] }` and normalizes `_id` to `id`, numeric price/stock values, category labels, active state, and a fallback image.

`AdminProducts.jsx` uses:

```http
POST http://localhost:5000/api/products/
PUT  http://localhost:5000/api/products/:id
```

Create and update requests use `FormData` with these fields:

| Field | Create | Update |
| --- | --- | --- |
| `name` | Required | Required |
| `description` | Required | Required |
| `price` | Required and greater than 0 | Required and greater than 0 |
| `stock` | Required and non-negative | Required and non-negative |
| `image` | Required file | Only sent when a replacement file is selected |

The frontend does not manually set `Content-Type` for these requests.

The Delete button currently removes the row from local React state only. It does not call a backend DELETE endpoint, so a reload restores the product.

### Admin orders

`AdminOrders.jsx` displays `initialOrders` from `src/admin/data/mockData.js`. There is no order API call or order mutation flow in the current frontend.

## Backend Integration Contract

The backend is not included in this workspace. The active admin code assumes:

- API origin: `http://localhost:5000`.
- Login endpoint: `POST /api/admin/login`.
- Product list endpoint: `GET /api/products`.
- Product create endpoint: `POST /api/products/` with multipart form data.
- Product update endpoint: `PUT /api/products/:id` with multipart form data.
- Bearer authentication is accepted for protected admin requests.

The frontend does not currently verify that these endpoints exist or that the server supports the exact response shapes. CORS must allow the Vite development origin.

## Legacy or Unused API Utility

`src/utils/productUtils.js` contains a separate `api` object and `API_BASE = 'http://localhost:5001/api'`. It uses JSON requests for product CRUD and is not imported by the current `App`, `HomePage`, or admin pages. Do not treat it as the active API path without first refactoring callers and reconciling its contract with the admin code.

## Localization and Currency

Translations are defined in `src/locales/en.js` and `src/locales/ar.js`. `src/utils/translations.js` provides:

- `getTranslation(language, path)` for dot-separated keys.
- `formatCurrency(amount, language)` using EGP formatting, displaying `E£` in English and `ج.م` in Arabic.

The language provider updates `document.documentElement.lang` and `document.documentElement.dir`. Some About page and admin text is still written inline rather than in the locale dictionaries.

## Styling

- `src/index.css` contains storefront styles, responsive rules, animations, dark theme variables, and the Tailwind v4 import.
- `src/admin/styles/admin.css` contains the light admin dashboard theme, tables, cards, forms, modal, status badges, and responsive admin rules.
- `LoginPage.jsx` uses Tailwind utility classes.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Available scripts are `dev`, `build`, and `preview`. There is no test or lint script in `package.json`, and `src/test.yaml` is empty.

## Known Limitations

- Storefront products are static and are not loaded from the backend.
- Checkout is a simulation with no real order or payment processing.
- Admin orders and revenue are mock data.
- Admin delete is local-only.
- There is no local token expiry or refresh-token flow.
- The 18+ requirement is shown in the UI but there is no age-verification gate.
- The Header wishlist button looks for a `#wishlist` section, but no dedicated wishlist section is currently rendered.
- Product images depend on external URLs.
- Contact information in the About page is static.
- `src/utils/productUtils.js` uses a different, currently unused API origin and JSON contract.
- `README.md` is a short summary and contains stale customization references; this file is the more complete context reference.

## Recommended Next Changes

1. Add a single environment-based API constant, such as `VITE_API_URL`, and remove the unused `5001` helper or make it the shared implementation.
2. Connect storefront products to the same product API used by the admin area, with a static fallback if desired.
3. Implement backend DELETE and refresh/invalidate product data after mutations.
4. Replace mock admin orders with a real orders endpoint.
5. Send checkout data to a backend order service and integrate a compliant payment provider.
6. Add token expiry handling and redirect on `401` responses.
7. Add automated tests for filters, cart totals, persistence, route protection, and checkout validation.
8. Move remaining inline user-facing strings into the English and Arabic locale files.

---

Last verified against the current files in `src/`, `package.json`, `postcss.config.js`, and `vite.config.js` on 2026-09-06.
# Power Store — PROJECT_CONTEXT

Professional reference for engineers and AI assistants. This repo is primarily the **React (Vite) frontend**. The backend is assumed to run separately (e.g. Node/Express on port **5000**). Adjust URLs for production deployments.

---

## Project Overview

| Item | Description |
|------|--------------|
| **Project name** | **Power Store** (`power-store` in `package.json`) |
| **Purpose** | E-commerce storefront with an **admin dashboard** for managing products |
| **Primary repo focus** | Frontend application under `Power-Store/` |

### Tech Stack

| Layer | Technology |
|-------|-------------|
| UI | React 18 |
| Routing | React Router v6 |
| Build | Vite 5 |
| Styling | Custom CSS (`src/index.css`), admin-specific CSS (`src/admin/styles/admin.css`), Tailwind v4 via `@import "tailwindcss"` for **login page** utilities |
| HTTP | `fetch` (no Axios in dependencies; Bearer auth wrapped in `adminFetch`) |
| State | React `useState` / `useEffect`; context providers for cart, wishlist, language, toasts |

### Frontend Structure

```
Power-Store/
├── index.html
├── vite.config.js
├── postcss.config.js          # Tailwind PostCSS (@tailwindcss/postcss)
├── package.json
├── src/
│   ├── main.jsx               # Entry, imports index.css
│   ├── App.jsx                # Routes, providers, Header/footer shell
│   ├── index.css              # Global storefront styles + Tailwind import
│   ├── components/          # Header, Hero, ProductCard, Cart, Checkout, etc.
│   ├── pages/                  # HomePage, AboutPage, LoginPage
│   ├── context/               # Cart, Wishlist, Language, Toast
│   ├── locales/               # i18n (en, ar)
│   ├── data/                   # Static product fallback data
│   ├── utils/                  # translations, productUtils
│   └── admin/                  # Admin area (scoped)
│       ├── styles/admin.css    # Dashboard theme (cards, tables, modal)
│       ├── components/
│       │   ├── AdminLayout.jsx      # Sidebar + Outlet
│       │   ├── ProductsTable.jsx    # Dashboard product table snippet
│       │   └── ProtectedAdminRoute.jsx
│       ├── hooks/useProducts.js     # Fetch products list (authenticated)
│       ├── utils/auth.js           # JWT localStorage helpers
│       ├── utils/adminApi.js       # fetch with Authorization Bearer
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminProducts.jsx    # CRUD UI (create/update live; delete local-only)
│       │   └── AdminOrders.jsx     # Mock data currently
│       └── data/mockData.js       # Fallback orders/metrics helpers
└── PROJECT_CONTEXT.md         # This file
```

### Backend Structure

The **backend is not included in this frontend repository**. Documentation below reflects **URLs and conventions used by this frontend** and typical Express + `multer` patterns. Maintain a matching section in your backend repo with exact route handlers, validators, and S3/AWS config.

**Assumed backend base:** `http://localhost:5000`

---

### Admin Dashboard Details

| Aspect | Detail |
|--------|--------|
| **Routes** | `/login` → public admin login. `/admin/*` → wrapped in `ProtectedAdminRoute`; requires JWT in `localStorage`. |
| **Default redirect** | `/admin` → `dashboard`; unauthenticated `/admin/*` → `/login` (with optional `location.state.from`). |
| **Layout** | `AdminLayout`: sidebar links Dashboard, Products, Orders; Logout clears token. |
| **Pages** | **Dashboard**: metrics + fetched products table via `useProducts`. **Products**: full list, Add/Edit modal, Delete (local state only until API wired). **Orders**: mock table. |
| **Styling** | Light admin theme (`--bg`, `--accent`, cards, tables); product modal extended classes in `admin.css`. |

---

## APIs

**Base URL (dev):** `http://localhost:5000`

> **Important:** Replace `localhost:5000` with your production API origin and enable **CORS** for the SPA origin.

### 1. Admin Login

| Field | Value |
|-------|--------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/admin/login` |
| **Auth** | Public (no Bearer token). |
| **Required headers** | `Content-Type: application/json` |
| **Request body (JSON)** | `{ "username": string, "password": string }` |

**Frontend:** `src/pages/LoginPage.jsx` — credential field is **`username`** (not email).

**Response (example — align with backend):**

```json
{
  "token": "<jwt-string>"
}
```

`extractTokenFromResponse` also accepts shapes: `jwt`, `accessToken`, or `data.token`.

---

### 2. Get Products (list)

Used by storefront and admin hooks.

| Field | Value |
|-------|--------|
| **Method** | `GET` |
| **URL** | `http://localhost:5000/api/products` (also used without trailing slash in code) |
| **Auth** | **Admin/dashboard fetch:** Bearer recommended if API is protected. **HomePage** may call without token — depends on backend policy. |

**Frontend:**

- `src/admin/hooks/useProducts.js` — `GET` via `adminFetch` (sends Bearer if present).
- `src/pages/HomePage.jsx` — `fetch('http://localhost:5000/api/products')` (verify if backend allows public GET).

**Required headers:** None for plain GET; optionally `Authorization: Bearer <token>` for protected routes.

**Response (example — typical patterns):**

```json
[
  {
    "_id": "...",
    "name": "Product",
    "description": "...",
    "price": 99.99,
    "stock": 10,
    "countInStock": 10,
    "image": "https://...",
    "category": { "name": "Electronics" }
  }
]
```

Or wrapped:

```json
{ "products": [ ... ] }
```

Frontend normalizes `_id` → `id` and merges `stock` / `countInStock`.

---

### 3. Create Product

| Field | Value |
|-------|--------|
| **Method** | `POST` |
| **URL** | `http://localhost:5000/api/products/` (trailing slash in `AdminProducts.jsx`) |
| **Auth** | **Required:** `Authorization: Bearer <token>` |

**Headers:** Do **not** set `Content-Type` manually — browser sets `multipart/form-data` with boundary when using `FormData`.

**Body:** `multipart/form-data` only. Supported fields sent by frontend:

| Field | Required | Notes |
|-------|-----------|-------|
| `name` | Yes | string |
| `description` | Yes | string |
| `price` | Yes | appended as string (e.g. `"19.99"`) |
| `stock` | Yes | appended as string |
| `image` | Yes | **File** — frontend validates file chosen before submit |

**Response (example):**

```json
{
  "product": {
    "_id": "...",
    "name": "...",
    "description": "...",
    "price": 19.99,
    "stock": 5,
    "image": "https://..."
  }
}
```

Or the product object at root — frontend uses `normalizeProduct(payload?.product || payload)`.

---

### 4. Update Product

| Field | Value |
|-------|--------|
| **Method** | `PUT` |
| **URL** | `http://localhost:5000/api/products/:id` (frontend builds: base `.../api/products/` + `editing.id`) |
| **Auth** | **Required:** `Authorization: Bearer <token>` |

**Body:** `multipart/form-data`:

- Always: `name`, `description`, `price`, `stock`
- **`image`:** appended **only if** the user selects a new file → preserves existing server image otherwise

---

### 5. Delete Product

| Status | Detail |
|--------|--------|
| **Backend** | Typical pattern: `DELETE http://localhost:5000/api/products/:id` with Bearer token — **confirm in your backend repo**. |
| **Frontend** | **Not implemented.** `handleDelete` in `AdminProducts.jsx` only removes the row from **local React state**; reload will show the product again. |

---

## Authentication Flow

1. User opens `/login`, submits **username** + password.
2. `POST /api/admin/login` returns JSON containing a JWT (or aliased keys supported by `extractTokenFromResponse`).
3. Frontend stores JWT: `localStorage.setItem('adminToken', token)` (`src/admin/utils/auth.js`).
4. `ProtectedAdminRoute` checks `isAdminAuthenticated()`; if missing, redirects to `/login` with optional `state.from`.
5. **Authenticated API calls:** `adminFetch()` merges `Authorization: Bearer ${getAdminToken()}` into headers. **`Content-Type` is not forced** — correct for multipart (browser sets boundary).
6. Logout: `clearAdminToken()` and navigate to `/login`.

**Persisted login:** Refresh keeps session until token is cleared or expired (no refresh-token flow in this frontend).

---

## Product System

### Product Schema (frontend normalization)

After API response, products are normalized in `normalizeProduct`:

| Normalized field | Source |
|------------------|--------|
| `id` | `_id` or `id` |
| `name` | `name` |
| `description` | `description` |
| `price` | number |
| `stock` | `stock` ?? `countInStock` |
| `image` | URL string or fallback placeholder |
| `category` | string or populated object `.name` / `.title` |
| `isActive` | boolean if present |

**Backend create/update contract (enforced when sending):** only **`name`, `description`, `price`, `stock`, `image` (file on create)**. Do **not** send category/brand/isActive in multipart for those routes unless the backend explicitly adds them.

### Required Fields (forms)

| Action | Required |
|--------|----------|
| **Create** | name, description, price &gt; 0, stock ≥ 0, **image file** |
| **Update** | same text/stock validations; image file **optional** (keep existing) |

### Image Upload Flow (frontend)

1. User selects file → `FileReader` sets preview (`data:` URL) and stores `imageFile` (actual `File`).
2. On submit: `buildProductFormData` appends strings + optionally `image` file.
3. **`adminFetch`** sends `body: FormData` — **no** manual JSON `Content-Type`.

### AWS S3 Integration

There is **no S3 SDK in this frontend**. Files are uploaded to **your backend** as multipart fields. If the backend uses **AWS S3** (or similar), that logic lives **server-side** (e.g. `multer` memory/disk upload → SDK `putObject`). Document bucket, ACL, and public URL mapping in the **backend** project.

### Backend `req.file`

Express + **multer** (or equivalent) exposes the uploaded binary as **`req.file`** (often field name **`image`**). Field name in FormData **`image`** must match `multer.single('image')` (or `.fields`) on the server.

---

## Frontend Notes

### Key Components & Pages

| Path | Role |
|------|------|
| `App.jsx` | Router, contexts, `/login`, `/admin/*` nested routes |
| `ProtectedAdminRoute.jsx` | Auth gate |
| `AdminLayout.jsx` | Sidebar, `Outlet`, logout |
| `AdminProducts.jsx` | Product table, modal form, POST/PUT `FormData`, toasts |
| `useProducts.js` | Initial product list GET with Bearer |
| `ProductsTable.jsx` | Dashboard-focused table (subset of columns) |
| `LoginPage.jsx` | Tailwind-styled login |

### Admin Product Modal Behavior

- **Single reusable form** (`ProductForm`): `initial` truthy ⇒ **Edit mode** (`Update Product`), else **Add** (`Save Product`).
- **Edit:** Prefills name, description, price, stock, image preview from selected row.
- **`useEffect` on `initial`:** Not present — reopening modal for different rows may reset form only when modal remounts; if bugs appear, sync form state when `initial` changes.

### API Integration Logic

| Operation | Implementation |
|-----------|------------------|
| List | `useProducts` → `adminFetch(GET /api/products)` |
| Create | `adminFetch(POST, FormData)` to products base URL |
| Update | `adminFetch(PUT, FormData)` to `.../products/:id` |
| Delete UI | Local state filter only |

### State Management Approach

No Redux. Local `useState` in pages; global concerns via **Cart / Wishlist / Language / Toast** contexts. Admin token purely **localStorage** + guards.

---

## Important Development Notes

### Current Backend Limitations (as consumed by frontend)

- Create expects **multipart** only; **`image` required** on create.
- Extra fields (**category, brand, isActive**) may exist on GET responses but **must not** be relied on for create/update payload unless backend is updated.
- **GET /api/products** may be public or protected — HomePage vs admin inconsistency should match production policy.

### Unsupported Fields on Write

Do not send JSON bodies for create with old shapes (`brand`, `category`, `countInStock`-only, etc.). Use **exact** multipart keys: `name`, `description`, `price`, `stock`, `image` (when required).

### Common Bugs Encountered & Fixes

| Issue | Cause | Solution applied |
|-------|--------|-------------------|
| `vite` not found | `node_modules` out of sync / dev-deps missing | Run `npm ci --include=dev` (or `npm install`) |
| Admin `npm run dev` fails | Missing local `vite` binary | Restore full install from lockfile |
| 400 on create | JSON body vs missing file / wrong fields | Switched to **FormData** + required image file |
| Trailing slash URL | Frontend uses `/api/products/` for POST base | Backend should accept routing or unify URL in one constant |
| Bearer on multipart | Manual `Content-Type` breaking boundary | **`adminFetch` does not overwrite** multipart; avoid setting `Content-Type` for FormData |

### Warnings — Do Not Break

1. **`adminFetch` + FormData:** Never add `Content-Type: application/json` when body is FormData.
2. **Create always needs `image` file** client-side validation.
3. **Update:** omit `image` key entirely when no new file — backend keeps previous image (verify server behavior).
4. **Token key** is fixed: `adminToken` in localStorage (`auth.js`).
5. **Login body** uses `username`, not `email`.

---

## Future Improvements

- [ ] Wire **DELETE** product to backend `DELETE /api/products/:id` and refresh list or invalidate cache.
- [ ] Align **single** products base URL (trailing slash) across `useProducts.js` vs `AdminProducts.jsx`.
- [ ] Use **React Router `loader`/query cache** or SWR/React Query for product list staleness after mutations.
- [ ] **`ProductForm`** reset/sync when `editing` id changes without unmount (controlled `useEffect` on `initial`).
- [ ] Env-based **API_BASE_URL** (`import.meta.env.VITE_API_URL`).
- [ ] Optional: add **Axios** instance mirroring `adminFetch` interceptors if team standardizes on Axios.
- [ ] Refresh token / session expiry UX (redirect to login on `401`).
- [ ] Backend doc: finalize **S3** URL storage in DB and CORS rules for uploads.

---

*Last aligned with frontend source under `Power-Store/src` (admin products, auth, routing). Backend examples are illustrative until your server repository is canonically documented.*
