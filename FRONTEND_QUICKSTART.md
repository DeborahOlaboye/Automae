# Frontend Quick Start - Automae Dashboard

## The Issue You Hit

You were in `frontend/` but the Next.js app is in `frontend/automae-dashboard/`

## Correct Steps

### Navigate to the Right Directory
```bash
cd frontend/automae-dashboard
```

### Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14.2.18
- React 18.3.1
- Tailwind CSS
- TypeScript
- Lucide Icons
- Ethers.js
- And more (441 packages total)

### Run Development Server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000

✓ Starting...
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.2s
```

### Open Browser
```bash
open http://localhost:3000
```

Or manually visit: http://localhost:3000

---

## Directory Structure Explained

```
Cronos New/
└── frontend/
    ├── package.json          ❌ Wrong - empty package
    └── automae-dashboard/  ✅ Correct - Next.js app
        ├── app/              # Pages
        ├── components/       # Components
        ├── package.json      # Real dependencies
        └── ...
```

---

## What You'll See

### Landing Page (/)
- Beautiful hero with gradient text
- Feature grid (6 cards)
- How it works section
- Call-to-action buttons
- Responsive design

### Dashboard (/dashboard)
- Sidebar navigation
- 4 stat cards
- Asset grid
- Activity feed
- Search & notifications

---

## Quick Commands

```bash
# From project root
cd frontend/automae-dashboard

# Install
npm install

# Development
npm run dev

# Build for production
npm run build

# Start production
npm start

# Lint
npm run lint
```

---

## Troubleshooting

### Error: Couldn't find pages or app directory
**Solution**: Make sure you're in `frontend/automae-dashboard/`, not just `frontend/`

```bash
# Check where you are
pwd
# Should show: .../Cronos New/frontend/automae-dashboard

# If not, navigate correctly
cd automae-dashboard
```

### Port 3000 already in use
**Solution**: Kill the process or use different port

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### npm install fails
**Solution**: Clear cache and retry

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## Environment Setup (Optional)

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit if needed
nano .env.local
```

Default values work for local development:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_CRONOS_RPC=https://evm-t3.cronos.org
NEXT_PUBLIC_CHAIN_ID=338
```

---

## Verify Installation

After `npm run dev`, you should see:

1. **Terminal Output**:
   ```
   ✓ Ready in 2.5s
   ○ Compiling / ...
   ✓ Compiled / in 1.2s
   ```

2. **Browser** (http://localhost:3000):
   - Landing page loads
   - Gradient text visible
   - Blue/indigo color scheme
   - Smooth animations

3. **Dashboard** (http://localhost:3000/dashboard):
   - Sidebar with navigation
   - 4 metric cards
   - Asset list
   - Activity feed

---

## Next Steps

1. ✅ Frontend is running
2. Start backend API:
   ```bash
   cd ../../backend
   npm run dev
   ```
3. Both should run simultaneously:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## Summary

**Correct Directory**: `frontend/automae-dashboard/`
**Install**: `npm install`
**Run**: `npm run dev`
**Visit**: http://localhost:3000

**You're ready to see the beautiful UI!** 🎨
