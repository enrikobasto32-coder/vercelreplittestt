# Vercel Deployment Guide

## Overview
This is a **fullstack Node.js application** (Express + React) that runs as a single Node.js process. It's optimized for Vercel's standard Node.js runtime.

## Deployment Architecture
- **Framework**: Express.js (Node.js)
- **Frontend**: React + Vite (bundled into `dist/public`)
- **Backend**: Express API + static file serving
- **Database**: PostgreSQL (via Vercel Postgres or external provider)
- **Deployment Type**: Standard Node.js (not serverless)

## Before Deploying

### 1. Set Environment Variables in Vercel
Navigate to your project settings → Environment Variables and add:

```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
```

**Important**: Get your `DATABASE_URL` from:
- Vercel Postgres (recommended): Use Vercel's integrated PostgreSQL
- External Database: Any PostgreSQL provider (e.g., Neon, Supabase, Railway, AWS RDS)

### 2. Database Setup
On first deploy, the database migrations will NOT run automatically. You need to run them manually:

```bash
# After deploying and confirming the app is running:
npm run db:push
```

Or add a post-deploy script (not recommended for production):
```json
// package.json - optional
"scripts": {
  "vercel-build": "npm run build && npm run db:push"
}
```

## Vercel Deployment Settings

The `vercel.json` file is pre-configured with:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Framework** | Express |
| **Node.js Version** | 20.x |
| **Install Command** | `npm install` (auto-detected) |
| **Start Command** | `npm start` (auto-detected) |

## Build Process
The build command (`npm run build`) does:
1. **Client Build**: Vite builds React frontend → `dist/public`
2. **Server Build**: esbuild bundles Express server → `dist/index.cjs`
3. **Output**: Single `dist/` directory ready for deployment

## Start Command
```bash
npm start
# Runs: NODE_ENV=production node dist/index.cjs
```

The server will:
- Start on port provided by Vercel (via `process.env.PORT`)
- Serve the API on `/api/*`
- Serve the frontend from `dist/public`
- Fall back to `index.html` for SPA routing (all routes handled by React Router)

## Deployment Steps

### 1. Push to Git
```bash
git add .
git commit -m "Deploy to Vercel"
git push
```

### 2. Connect Vercel
- Go to https://vercel.com/new
- Select your Git repository
- Vercel will auto-detect Next.js is not being used (uses Node.js)
- Click "Deploy"

### 3. Configure Database
- After first deploy (it will fail without DATABASE_URL)
- Add `DATABASE_URL` environment variable
- Redeploy or trigger a rebuild

### 4. Run Database Migrations
After the app is running with DATABASE_URL:
```bash
# Option A: Via Vercel CLI
vercel env pull
npm run db:push

# Option B: Via Vercel Deployments (if you have a custom script)
# This requires adding `vercel-build` to package.json
```

## Production Checklist
- [ ] `DATABASE_URL` environment variable is set
- [ ] Database migrations have run (`npm run db:push`)
- [ ] App starts without errors: `npm start`
- [ ] Frontend loads at `/`
- [ ] API endpoints work at `/api/*`
- [ ] SPA routing works (navigate between pages)
- [ ] Dark/light mode works
- [ ] All features functional

## Troubleshooting

### Build Fails: "Could not find the build directory"
Make sure `npm run build` completes successfully locally:
```bash
npm run build
npm start
```
Visit `http://localhost:5000` to verify.

### App Crashes: "DATABASE_URL must be set"
Add the `DATABASE_URL` environment variable in Vercel project settings and redeploy.

### Database Migrations Fail
Run manually after deploy:
```bash
npm run db:push
```

### Port Issues
The app automatically uses `process.env.PORT` provided by Vercel. Don't hardcode port 5000 in production.

### Cold Start Slow
The app bundles dependencies to reduce syscalls. Expect ~3-5 second cold start on Vercel.

## File Structure (Production)
After `npm run build`, Vercel deploys:
```
dist/
├── index.cjs         # Bundled Express server
├── node_modules/     # Production dependencies
└── public/           # Static frontend (Vite build output)
    ├── index.html
    ├── assets/
    └── favicon.png
```

## Monitoring
Check deployment logs in Vercel Dashboard:
1. Go to your project
2. Click "Deployments"
3. Click the latest deployment
4. View "Logs" tab for build and runtime logs

## Rollback
If a deployment fails:
1. Go to Deployments in Vercel
2. Click on a previous successful deployment
3. Click "Promote to Production"

## Support
- Vercel Docs: https://vercel.com/docs
- Express Docs: https://expressjs.com/
- Vite Docs: https://vitejs.dev/
