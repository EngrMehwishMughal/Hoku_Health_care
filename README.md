# HOKU Health Care

HOKU Health Care is a responsive healthcare management platform built with React and Vite. The project includes a public healthcare website, doctor portal, patient authentication pages, and an administrative dashboard for managing core healthcare operations.

## Project Overview

The platform is designed to provide a clear and accessible experience for patients, doctors, healthcare staff, and administrators.

### Main Areas

- Public healthcare website
- Doctor registration and authentication
- Patient registration and authentication
- Doctor dashboard
- Admin dashboard
- Appointment management
- Patient and doctor management
- Healthcare service management
- Reminder and review management
- Contact and location information

## Features

### Public Website

- Responsive public navigation
- Healthcare services listing
- Individual service detail pages
- Specialist search and filtering
- Contact information and enquiry form
- Google Maps location
- Appointment call-to-action sections
- Mobile-first responsive layouts

### Doctor Portal

- Doctor login
- Doctor registration
- Secure authentication flow
- Doctor dashboard
- Appointment management
- Patient history
- Availability management
- Professional profile management


### Admin Dashboard

- Secure admin login
- Dashboard statistics
- Doctor management
- Patient management
- Appointment management
- Service management
- Reminder management
- Review management
- Responsive sidebar and top navigation
- Role-aware administrator access

## Technology Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- React Toastify
- Lucide React
- React Icons

### Development and Integration

- REST API integration
- Axios interceptors
- Local storage authentication
- Mock API server
- Responsive component architecture

## HOKU Theme

The interface uses a consistent healthcare-focused visual system.

| Purpose | Color |
|---|---|
| Primary | `#1E63C6` |
| Primary Dark | `#174FA0` |
| Secondary | `#B7CF35` |
| Page Background | `#FCFCFD` |
| Main Text | `#0F172A` |
| Supporting Text | `#64748B` |
| Border | `#E2E8F0` |

## Project Structure

```text
src/
├── components/
│   ├── admin/
│   ├── contact/
│   ├── doctor/
│   ├── services/
│   ├── specialists/
│   └── common/
├── context/
│   └── AuthContext.jsx
├── data/
│   ├── ServicesData.js
│   └── SpecialistData.js
├── layouts/
├── pages/
│   ├── admin/
│   ├── doctor/
│   ├── patient/
│   └── public/
├── services/
│   ├── api.js
│   ├── adminAuthApi.js
│   └── doctorApi.js
├── routes/
├── styles/
├── App.jsx
└── main.jsx
```

The exact folder names may vary depending on the current project organization.

## Main Routes

### Public Routes

```text
/
/services
/services/:slug
/specialists
/contact
/appointment
```

### Doctor Routes

```text
/doctor/login
/doctor/register
/doctor/dashboard
/doctor/appointments
/doctor/patients
/doctor/availability
/doctor/profile
```

### Patient Routes

```text
/patient/login
/patient/register

```

### Admin Routes

```text
/admin/login
/admin/dashboard
/admin/doctors
/admin/patients
/admin/appointments
/admin/services
/admin/reminders
/admin/reviews
```

### Install Dependencies

```bash
npm install
```

### Start the Frontend

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

## Environment Configuration

Create a `.env` file in the frontend project root.

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
```

Use environment variables in the Axios configuration where appropriate.

```js
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "/api",
  timeout:
    Number(import.meta.env.VITE_API_TIMEOUT) ||
    10000,
});
```

## Mock API Server

The frontend can be connected to a separate Express mock server during development.

Default mock API URL:

```text
http://localhost:8000/api
```

Start the mock server from its own project folder:

```bash
npm install
npm run dev
```

Confirm that the frontend API base URL matches the mock server URL.

## Authentication

Doctor authentication currently uses a token stored in local storage.

```text
doctor-token
```

The Axios response interceptor can request a refreshed token through:

```text
POST /api/auth/refresh
```

Admin authentication is handled separately through the admin authentication service.

Authentication tokens should be replaced with a secure production strategy when the real backend is connected. Prefer secure, HTTP-only cookies when supported by the backend.

## Example Admin Account

For mock development only:

```text
Email: admin@hoku.com
Password: admin123
```

Remove or replace mock credentials before production deployment.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs the configured code-quality checks.

Available scripts depend on the current `package.json`.

## Building for Production

```bash
npm run build
```

The production files will be created in:

```text
dist/
```

Test the production build locally:

```bash
npm run preview
```

## Deployment

The Vite frontend can be deployed to:

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- Any static hosting provider

When deploying, configure the following:

- Environment variables
- API base URL
- SPA route fallback
- Backend CORS permissions
- Secure authentication settings

For Vercel, add a route rewrite when direct React Router URLs return a 404.

Example `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## Responsive Design

The user interface is designed for:

- Mobile devices
- Tablets
- Laptops
- Desktop screens

Shared page containers control consistent width and spacing.

```jsx
export default function PageContainer({
  children,
  className = "",
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-10 ${className}`}
    >
      {children}
    </div>
  );
}
```


## Current Development Status

The project currently includes:

- Responsive admin authentication
- Responsive doctor authentication
- Responsive patient authentication
- Public services page
- Service details handling
- Specialist listing with filters
- Contact page
- Contact form
- Contact information cards
- Responsive map integration
- Admin management modules
- Mock server integration structure


## Author

**Mehwish Mughal**  
Frontend Lead

---

Built for a responsive, accessible, and patient-centered healthcare experience.
