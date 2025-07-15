# قاعة السلطان (Elsultan)

A modern Next.js 13+ app for quote management with protected authentication and a clean, elegant UI.

## Features
- **Login page at `/`**: Only authenticated users can access the main app.
- **Username/password authentication**: (admin / secret123)
- **Cookie-based session**: Stores `auth` and `username` cookies on login.
- **Middleware protection**: All routes except `/`, `/login`, and static files are protected.
- **Welcome message**: Displays the logged-in username on the home page.
- **Logout**: `/logout` route clears cookies and redirects to login.
- **Consistent background**: Elegant beige background across login and app pages.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Visit [http://localhost:9002](http://localhost:9002) (or the port you set) in your browser.

### 3. Login
- Go to `/` (root).
- Use:
  - **Username:** `admin`
  - **Password:** `secret123`
- On success, you are redirected to `/home` and greeted with `Welcome, admin`.

### 4. Logout
- Click the **Logout** link in the header or visit `/logout`.
- This clears your session and returns you to the login page.

## Authentication & Middleware
- **Authentication** is handled on the client by setting cookies on login.
- **Middleware (`middleware.ts`)** runs on every request:
  - If not authenticated, redirects all protected routes to `/` (login).
  - If authenticated and visiting `/`, redirects to `/home`.
  - Static files and `/logout` are always accessible.
- **Username** is stored in a cookie and shown in the welcome message.

## Deployment (Vercel)
- The app is designed for Vercel and uses Next.js Edge Middleware.
- **Important:**
  - The root page (`/page.tsx`) and `/home/page.tsx` use `export const dynamic = "force-dynamic";` to ensure middleware always runs (no static caching).
- After deploying, you should always see the login page first at your root URL.

## Customization
- To change credentials, update the logic in `src/app/page.tsx` and `src/app/login/page.tsx`.
- To change the welcome message, edit `src/app/home/page.tsx`.
- To adjust protected routes, update the matcher in `middleware.ts`.

## License
MIT
