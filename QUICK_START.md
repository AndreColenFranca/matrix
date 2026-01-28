# Quick Start - Supabase Integration

Get the Eisenhower AI Matrix up and running with Supabase in under 10 minutes.

## 30-Second Overview

The app now requires authentication and stores data in a cloud database instead of localStorage. **New setup required.**

## 5-Minute Setup

1. **Create Supabase Project**
   - Go to https://supabase.com → "New Project"
   - Save your API credentials

2. **Create Database Schema**
   - In Supabase SQL Editor, paste and run the full SQL from `SUPABASE_SETUP.md` (Step 3)
   - Takes ~30 seconds

3. **Enable Security & Realtime**
   - Run RLS SQL policies from `SUPABASE_SETUP.md` (Step 4)
   - Enable Realtime for `tasks` table in Supabase UI

4. **Add Credentials**
   ```bash
   # Edit .env file:
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

6. **Create Account & Test**
   - Click "Criar Conta"
   - Add a task
   - Watch it appear in the matrix
   - ✅ Done!

## Key Changes from Old Version

| Feature | Before | After |
|---------|--------|-------|
| Authentication | None | Email/password |
| Data Storage | Browser localStorage | Cloud PostgreSQL |
| Users | Single | Multi-user with isolation |
| Sync | No | Realtime across tabs |
| Persistence | Browser only | Cloud, any device |
| Configuration | Settings modal only | Saved to database |

## File Structure

```
matrix/
├── lib/
│   └── supabaseClient.ts        # Supabase client setup
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── hooks/
│   ├── useTasks.ts              # Task CRUD + realtime
│   └── useUserConfig.ts         # Config management
├── components/
│   └── Auth/
│       └── Login.tsx            # Login/signup UI
├── types/
│   └── database.types.ts        # Database schema types
│
├── App.tsx                      # Updated with auth
├── types.ts                     # Updated Task interface
├── index.tsx                    # Wrapped with AuthProvider
│
├── SUPABASE_SETUP.md            # Full setup guide
├── IMPLEMENTATION_SUMMARY.md    # Technical details
└── QUICK_START.md               # This file
```

## Common Tasks

### Login Issues?
- Check `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify Supabase project is created
- Restart dev server after changing `.env`

### Tasks Not Saving?
- Check RLS policies are created (SUPABASE_SETUP.md Step 4)
- Look for errors in browser console
- Verify you're logged in

### Realtime Not Working?
- Confirm realtime is enabled for `tasks` table
- Refresh the page
- It only works for same user on same domain

### Need Full Details?
→ Read `SUPABASE_SETUP.md` for step-by-step instructions

## Architecture at a Glance

```
Login Screen ──┐
              ├──> AuthContext ──> Supabase Auth
              │
App.tsx ──────┤
              ├──> useTasks ────────> Database (tasks table)
              │
              ├──> useUserConfig ──> Database (user_config table)
              │
              └──> Realtime ───────> Live sync across devices
```

## What's New

✨ **Features**:
- Multi-user support with secure data isolation
- Email/password authentication
- Cloud data storage with automatic backups
- Live sync across tabs and devices
- Per-user UAZAPI configuration

🔒 **Security**:
- Row Level Security (RLS) at database level
- Session auto-refresh
- Secure token storage in Supabase

⚡ **Performance**:
- Indexed database queries
- Realtime throttling (10 events/sec)
- Optimized React rendering

## Next Steps

1. ✅ Complete setup (see 5-minute section above)
2. 📝 Create account and test the app
3. 🔧 Customize UAZAPI settings in the UI
4. 🚀 Optional: Deploy to production

## Troubleshooting Command

If something breaks:
```bash
# Check everything is installed
npm install

# Rebuild
npm run build

# Check environment variables
echo $VITE_SUPABASE_URL

# Start fresh
npm run dev
```

## Need Help?

- **Setup Issues** → `SUPABASE_SETUP.md` Troubleshooting section
- **Code Questions** → `IMPLEMENTATION_SUMMARY.md` Technical details
- **Supabase Docs** → https://supabase.com/docs
- **Project Status** → Last commit: `4a7653b` (Supabase integration complete)

## Summary

| Task | Status |
|------|--------|
| Supabase client setup | ✅ Complete |
| Authentication system | ✅ Complete |
| Database schema | ✅ Ready (manual setup) |
| Data layer hooks | ✅ Complete |
| UI updates | ✅ Complete |
| Documentation | ✅ Complete |
| Testing | ✅ Passed |
| Commits | ✅ 2 commits |

**Ready to use!** Just set up your Supabase project and add credentials to `.env`.

---

**Last Updated**: January 28, 2026 | **Version**: 1.0.0
