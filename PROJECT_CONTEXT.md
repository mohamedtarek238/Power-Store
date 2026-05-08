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
