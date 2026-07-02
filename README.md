# Event Customer Check-In Dashboard

A production-ready React + Vite application built as a technical assessment to manage customer registrations, QR-based check-ins, booth assignments, and event status tracking using a mock REST API powered by json-server.

## Live Demo

### Frontend (Vercel)

https://event-checkin-dashboard-sooty.vercel.app

### Backend API (Render)

https://event-checkin-dashboard-api-ip5d.onrender.com

---

## Overview

The application allows an event administrator to:

- Track registered customers and their current event status.
- Verify customers using QR code scanning or manual QR entry.
- Check in customers with duplicate check-in protection.
- Assign, change, and remove booth assignments.
- Track customer status changes with complete history.
- View live dashboard analytics generated from API data.

The backend is powered by **json-server** using **db.json** as a mock REST API.

---

## Features

- **Authentication** — email/password login, session persisted in `localStorage`, protected routes, auto-redirect for already-authenticated users.
- **Dashboard** — summary cards, check-in analytics chart, and quick actions, all computed from live customer data.
- **Customer Management** — list, search, filter by status, paginate, add, edit, view details, and delete customers.
- **QR Scanner** — live camera scanning (`html5-qrcode`) with a manual entry fallback, customer verification, and one-click check-in.
- **Booth Assignment** — assign/change/remove a booth for any checked-in customer, with duplicate-assignment and availability checks.
- **Customer Status** — update status (Waiting → Checked-In → Assigned → In Discussion → Completed / Follow-Up Required) with remarks and an optional follow-up date, plus a full status timeline per customer.
- **UX details** — loading, empty, and error states with retry across every data view; toast notifications for every mutation.
- **Responsive UI** — Optimized for desktop and tablet devices with a clean, consistent user experience across different screen sizes.

## Tech Stack

| Layer              | Choice                                           |
| ------------------ | ------------------------------------------------ |
| UI                 | React 19 (functional components + hooks)         |
| Build tool         | Vite                                             |
| Routing            | React Router v7                                  |
| Forms & validation | React Hook Form                                  |
| HTTP client        | Axios                                            |
| Notifications      | React Toastify                                   |
| Charts             | Recharts                                         |
| QR scanning        | html5-qrcode                                     |
| Mock backend       | json-server                                      |
| Linting            | ESLint (flat config) + eslint-plugin-react-hooks |

## Folder Structure

```
src/
├── api/                  # Axios instance (base URL, interceptors)
├── components/           # Reusable, presentational components
│   ├── customer/         # Search bar, filters, table, modals, loading/empty/error states, timeline
│   ├── icons/             # Shared inline SVG icon components
│   ├── qr/                # Camera scanner, manual entry, verification card
│   ├── Card/, Header/, Sidebar/, SummaryCard/
├── constants/             # Routes, config, status enums
├── context/               # AuthContext + AuthProvider
├── hooks/                 # Shared hooks (useAuth, useEscapeKey)
├── layouts/                # AuthLayout, MainLayout (sidebar + header shell)
├── pages/                  # One folder per route (Login, Dashboard, Customers, QRScanner, BoothAssignment, CustomerStatus, NotFound)
├── routes/                  # AppRoutes, ProtectedRoute
├── services/                 # Thin API wrappers — the only files that call Axios
└── utils/                     # Small shared helpers (status badge class lookup)
```

Path aliases (`@`, `@api`, `@components`, `@constants`, `@context`, `@hooks`, `@layouts`, `@pages`, `@routes`, `@services`, `@utils`) are configured in `vite.config.js` and `jsconfig.json`.

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

### Local Development

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Production

```env
VITE_API_BASE_URL=https://YOUR-RENDER-URL.onrender.com
```

---

## Running the Application

Start React:

```bash
npm run dev
```

Start Mock API:

```bash
npm run mock-server
```

React runs on:

```
http://localhost:5173
```

Mock API runs on:

```
http://localhost:5000
```

---

## Deployment

### Frontend

- Vercel

### Backend

- Render

The frontend communicates with the deployed backend using:

```env
VITE_API_BASE_URL=https://YOUR-RENDER-URL.onrender.com
```

---

## Demo Credentials

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `Admin@123`         |

The Login page also has a **"Use Demo Account"** button that fills these in for you — you still need to click **Sign In** to log in.

## API Endpoints

| Method | Endpoint                 | Purpose               |
| ------ | ------------------------ | --------------------- |
| GET    | `/users?email=`          | Login                 |
| GET    | `/customers`             | Get Customers         |
| POST   | `/customers`             | Create Customer       |
| PUT    | `/customers/:id`         | Update Customer       |
| DELETE | `/customers/:id`         | Delete Customer       |
| GET    | `/boothAssignments`      | Get Booths            |
| PUT    | `/boothAssignments/:id`  | Assign/Remove Booth   |
| GET    | `/customerStatusHistory` | Customer History      |
| POST   | `/customerStatusHistory` | Create Status History |

---

## Third-Party Libraries

- `react-router-dom` — client-side routing
- `react-hook-form` — form state and validation
- `axios` — HTTP client
- `react-toastify` — toast notifications
- `recharts` — dashboard chart
- `html5-qrcode` — camera-based QR scanning
- `json-server` — mock REST API for local development

## Project Flow

1. **Login** with the demo credentials (or use the "Use Demo Account" button) → redirected to the Dashboard.
2. **Dashboard** shows live totals and a status breakdown chart, pulled from `/customers` on every visit.
3. **Customers** page: add a new customer (auto-generated sequential QR code), search/filter/paginate, edit, view, or delete.
4. **QR Scanner**: scan a customer's QR code (camera or manual entry) → verify their details → **Check-In** (marks `checkedIn: true`, status → `Checked-In`, logs a status-history event).
5. **Booth Assignment**: pick a checked-in customer, assign an available booth (status → `Assigned`), change it later, or remove it (booth freed, status reverts to `Checked-In`).
6. **Customer Status**: pick any customer, set a new status + remarks (+ follow-up date if the status is `Follow-Up Required`) → appended to that customer's timeline.
7. **Logout** clears the stored session and redirects to Login.

## Screenshots

### Login

![Login](./screenshots/login.png)

---

### Dashboard

![Dashboard](./screenshots/dashboard.png)

---

### Customers

![Customers](./screenshots/customers.png)

---

### QR Scanner

![QR Scanner](./screenshots/qr-scanner.png)

---

### Booth Assignment

![Booth Assignment](./screenshots/booth-assignment.png)

---

### Customer Status

![Customer Status](./screenshots/customer-status.png)

---

## Assumptions

- Authentication is a mock flow against json-server (plaintext password match, fake JWT string) — acceptable for a front-end assignment, not production-grade auth.
- A customer's `checkedIn` flag is treated as a one-way flag: once true it stays true, even if their status is later changed away from `Checked-In` (e.g. to `Assigned` or `Completed`).
- Booth numbers are unique and fixed (seeded in `db.json`); the app does not support creating new booths.
- QR codes are unique strings matched case-insensitively against `customer.qrCode`.

## Known Limitations

- No automated tests.
- json-server is used instead of a production backend.
- No real authentication or JWT.
- No server-side pagination.
- No role-based authorization.

---

## Future Improvements

- Add unit tests (Vitest + React Testing Library) for services and key components.
- Add a real backend with proper authentication (hashed passwords, real JWTs, refresh tokens).
- Virtualize long lists and add server-side pagination once data volume grows.
- Add role-based access control (the `role` field already exists on the user record but isn't used yet).
- Code-split routes to reduce the initial JS bundle size.
