# Crimson Blood Moon — Production URL Shortener 🌑

A lightweight, production-ready URL shortener web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Neon PostgreSQL**, designed with the atmospheric **Crimson Blood Moon** aesthetic. Ready for zero-config deployment on **Vercel**.

---

## ✦ Features

- **Beautiful Crimson Blood Moon Homepage (`/`)** — An atmospheric dark interface for instantly shortening URLs with real-time feedback, deduplication detection, and session-recent link management.
- **Persistent Storage with Neon PostgreSQL** — Serverless PostgreSQL database connection using `@neondatabase/serverless`, ensuring high availability and zero mapping loss across redeployments.
- **Automatic Schema & Index Setup** — Automatically initializes the database schema (`links` table and indexes) on first run or via a standalone setup script (`npm run db:init`).
- **URL Deduplication** — Automatically detects when a destination URL has already been shortened and returns its existing short link rather than creating duplicate records.
- **Immutable Short Codes** — Unique ~6-character alphanumeric codes (`A-Za-z0-9`) verified by database-level `UNIQUE` constraints with safe collision retry handling. Mappings can never be overwritten or remapped.
- **Dynamic Origin Resolution** — Automatically constructs short URLs using the current production deployment origin (`req.headers.get('host')`, `VERCEL_URL`, etc.). Works on any Vercel subdomain or custom domain without hardcoded hostnames.
- **Built-in Security & Abuse Protection** — Rejects malformed URLs, dangerous protocol schemes (`javascript:`, `data:`, `file:`), internal/localhost addresses (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`), and same-service redirect loops. Includes an in-memory sliding window rate limiter (40 req/min per IP).
- **Interactive Developer Documentation (`/docs`)** — Dedicated API documentation page with complete endpoint references, HTTP status codes, request/response schemas, and ready-to-use **cURL**, **JavaScript (fetch)**, and **Python (requests)** code snippets with instant Copy buttons.
- **Responsive Theme** — Fully responsive across desktop, tablet, and mobile with accessible labels, smooth animations, and interactive Telegram buttons.

---

## ✦ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, `lucide-react` icons
- **Database:** Neon PostgreSQL (`@neondatabase/serverless`) with local zero-dependency SQLite fallback for offline development
- **Deployment Platform:** Vercel

---

## ✦ Routes Overview

| Route | Method | Description |
|---|---|---|
| `/` | `GET` | Main landing page & URL-shortening interface |
| `/docs` | `GET` | Developer API documentation & interactive examples |
| `/{code}` | `GET` | Resolves short code from Neon DB and redirects (`HTTP 307`) to destination |
| `/api/shorten` | `POST` | JSON API endpoint to create or retrieve short URLs |

> **Note:** Reserved application routes (`/docs`, `/api/...`, `/_next/...`, `/favicon.ico`, `/robots.txt`) are protected and can never be interpreted as short codes.

---

## ✦ Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/harshi79/dont-peek.git
cd dont-peek
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and configure your database connection string:
```bash
cp .env.example .env.local
```

Example `.env.local`:
```env
# Set your Neon PostgreSQL database connection string
DATABASE_URL="postgresql://user:password@ep-silent-moon-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> **Local Offline Fallback:** If `DATABASE_URL` is omitted or set to `file:./dev.db`, the application will automatically fall back to Node's built-in `node:sqlite` engine for local development and testing without needing external database access.

### 4. Initialize Database Schema
Run the database schema setup script to create the `links` table and indexes:
```bash
npm run db:init
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Neon PostgreSQL Setup Instructions

1. **Create a Neon Project:**
   - Go to [https://neon.tech](https://neon.tech) and log in.
   - Click **New Project** and choose a project name (e.g., `crimson-blood-moon`) and Postgres region.
2. **Copy the Connection String:**
   - From your project dashboard, copy the PostgreSQL connection string under **Connection Details**.
   - Ensure `sslmode=require` is appended to the connection URL.
3. **Initialize the Schema:**
   - Either run `npm run db:init` locally with your `DATABASE_URL` in `.env.local`, **or** execute the contents of `schema.sql` directly in the Neon SQL Editor:
     ```sql
     CREATE TABLE IF NOT EXISTS links (
         id SERIAL PRIMARY KEY,
         code VARCHAR(16) UNIQUE NOT NULL,
         url TEXT NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
     );

     CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
     CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
     ```

---

## ✦ Vercel Deployment Instructions

1. **Push your Code to GitHub:**
   - Ensure your changes are committed and pushed to your Git repository.
2. **Import Project into Vercel:**
   - Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
   - Leave the Framework Preset as **Next.js**.
3. **Configure Environment Variables:**
   - In the **Environment Variables** section of the Vercel deployment screen, add:
     - **Name:** `DATABASE_URL`
     - **Value:** Your Neon PostgreSQL connection string (from step 2 above).
4. **Deploy:**
   - Click **Deploy**. Vercel will build and deploy the application.
   - Your shortener is now live at `https://your-project-name.vercel.app`!
   - Short URLs will dynamically use your Vercel domain automatically.

---

## ✦ API Usage Example (`POST /api/shorten`)

### Request
```bash
curl -X POST https://your-project-name.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/some/really/long/url"}'
```

### Response (`201 Created` or `200 OK`)
```json
{
  "code": "K7xP2q",
  "short_url": "https://your-project-name.vercel.app/K7xP2q",
  "url": "https://example.com/some/really/long/url"
}
```

Visit the `/docs` page on your deployed website for interactive code snippets in **cURL**, **JavaScript**, and **Python**.

---

## ✦ Visual Identity & Attribution

- **Theme:** Crimson Blood Moon
- **Telegram Channel:** [https://t.me/yorifederation](https://t.me/yorifederation)
- **Telegram Profile:** [https://t.me/yorichiiprime](https://t.me/yorichiiprime)
