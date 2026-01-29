# Supabase Integration Setup Guide

This document walks you through setting up the Eisenhower AI Matrix with Supabase for multi-user authentication and cloud database storage.

## Overview

The Eisenhower AI Matrix has been refactored to use Supabase instead of localStorage. This provides:

- **User Authentication** - Email/password based auth system
- **Cloud Database** - PostgreSQL database for persistent task storage
- **Multi-User Support** - Each user has isolated data with Row Level Security (RLS)
- **Realtime Sync** - Live updates across tabs and devices
- **User Config Storage** - Persistent UAZAPI settings per user

## Prerequisites

1. A Supabase account (create at https://supabase.com)
2. Node.js 18+ installed
3. npm or yarn package manager

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in with your account
2. Click "New Project"
3. Fill in:
   - **Name**: "eisenhower-ai-matrix" (or your preference)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Start with Free tier
4. Click "Create new project" and wait for setup (5-10 minutes)

## Step 2: Get Your Credentials

1. Once the project is ready, click on the project name
2. Go to **Settings → API** (left sidebar)
3. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

## Step 3: Create Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Paste the following SQL and execute:

```sql
-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  quadrant TEXT NOT NULL CHECK (quadrant IN ('DO', 'SCHEDULE', 'DELEGATE', 'ELIMINATE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User config table (UAZAPI settings)
CREATE TABLE public.user_config (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uazapi_url TEXT DEFAULT 'https://free.uazapi.com/send/text',
  uazapi_token TEXT,
  uazapi_number TEXT DEFAULT '5531994718445',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at DESC);

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tasks
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_config
CREATE TRIGGER update_user_config_updated_at BEFORE UPDATE ON public.user_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click "Run" to execute the schema

## Step 4: Enable Row Level Security (RLS)

1. In the same SQL Editor, paste and execute:

```sql
-- Enable RLS on both tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_config ENABLE ROW LEVEL SECURITY;

-- Tasks policies: Users can only see/modify their own tasks
CREATE POLICY "Users can view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- User config policies: Users can only see/modify their own config
CREATE POLICY "Users can view their own config"
  ON public.user_config FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config"
  ON public.user_config FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own config"
  ON public.user_config FOR UPDATE
  USING (auth.uid() = user_id);
```

2. Click "Run"

## Step 5: Enable Realtime for Tasks

1. Go to **Realtime** (left sidebar)
2. Click on **Tables**
3. Find the `tasks` table and toggle it ON
4. This enables live subscription updates across connections

## Step 6: Configure Environment Variables

1. Open `.env` in your project root:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the values with the credentials from Step 2

**Important**: Never commit `.env` to git. It's already in `.gitignore`.

## Step 7: Install Dependencies

```bash
npm install
```

Supabase client (`@supabase/supabase-js`) is already added to package.json.

## Step 8: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` and show the login screen.

## Testing the Setup

### 1. Create Your First Account

1. Click "Criar Conta" tab
2. Enter an email and password (6+ characters)
3. Click "Criar Conta"
4. You should see a success message

### 2. Login

1. Click "Login" tab
2. Enter your email and password
3. Click "Entrar"
4. You should see the matrix interface

### 3. Add a Task

1. Enter a task description (e.g., "Finalizar relatório")
2. Click "Classificar"
3. The task should appear in the appropriate quadrant
4. Check your Supabase dashboard to verify it was saved

### 4. Test Realtime Sync

1. Open the app in two browser tabs
2. In Tab A, add a task
3. Watch Tab B update automatically (realtime!)
4. Delete the task in Tab A, see it disappear in Tab B

### 5. Logout and Login Again

1. Click the user menu (top left)
2. Click "Logout"
3. Login again with your credentials
4. Your tasks should still be there (data persistence)

## Verification Checklist

- [ ] Supabase project created
- [ ] API credentials copied to `.env`
- [ ] Database schema created
- [ ] Row Level Security enabled
- [ ] Realtime enabled for tasks table
- [ ] `npm install` completed
- [ ] Dev server starts without errors
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Can add tasks (they appear in matrix)
- [ ] Tasks persist after page refresh
- [ ] Can see tasks in Supabase dashboard
- [ ] Realtime sync works across tabs
- [ ] Can delete tasks
- [ ] Can change UAZAPI settings
- [ ] Settings persist after logout/login

## Troubleshooting

### "Missing Supabase environment variables"

**Problem**: Error on app startup
**Solution**:

1. Check `.env` file exists in project root
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are filled
3. Values should NOT have quotes around them
4. Restart dev server after changes

### "RLS policy violation"

**Problem**: Can't add/delete tasks, error about RLS
**Solution**:

1. Check Supabase RLS policies are created (Step 4)
2. Verify you're logged in (`useAuth` returns a user)
3. Check database policies in Supabase dashboard

### Tasks not appearing in matrix

**Problem**: Added task but it doesn't show
**Solution**:

1. Check browser console for errors
2. Verify task was saved in Supabase > Table Editor > tasks
3. Check your Supabase credentials are correct
4. Try refreshing the page (realtime might be delayed)

### Authentication not working

**Problem**: Login/signup doesn't work
**Solution**:

1. Verify Supabase API credentials are correct
2. Check browser console for error messages
3. Make sure password is at least 6 characters
4. Try signing up with a new email address

### Realtime not syncing

**Problem**: Changes in one tab don't appear in another
**Solution**:

1. Verify realtime is enabled for `tasks` table (Step 5)
2. Check both tabs are on the same domain
3. Try refreshing one tab
4. Realtime has a 10 event/second limit

## Database Structure

### tasks table

| Column     | Type        | Description                       |
| ---------- | ----------- | --------------------------------- |
| id         | UUID        | Unique task ID                    |
| user_id    | UUID        | User who owns the task            |
| text       | TEXT        | Task description                  |
| quadrant   | TEXT        | DO, SCHEDULE, DELEGATE, ELIMINATE |
| created_at | TIMESTAMPTZ | When task was created             |
| updated_at | TIMESTAMPTZ | Last update timestamp             |

### user_config table

| Column        | Type        | Description                 |
| ------------- | ----------- | --------------------------- |
| user_id       | UUID        | User who owns the config    |
| uazapi_url    | TEXT        | UAZAPI endpoint URL         |
| uazapi_token  | TEXT        | UAZAPI authentication token |
| uazapi_number | TEXT        | WhatsApp destination number |
| created_at    | TIMESTAMPTZ | When config was created     |
| updated_at    | TIMESTAMPTZ | Last update timestamp       |

## Architecture

```
┌─────────────────┐
│   React App     │
│   (localhost)   │
└────────┬────────┘
         │
    ┌────▼────────────┐
    │  AuthContext    │ ◄─ Session management
    │                 │    Login/Signup/Logout
    └────┬────────────┘
         │
    ┌────▼────────────────────────┐
    │  useTasks / useUserConfig    │ ◄─ Data hooks
    │  (React hooks)               │
    └────┬─────────────────────────┘
         │
    ┌────▼───────────────────────────────┐
    │  Supabase Client                    │
    │  (@supabase/supabase-js)            │
    └────┬────────────────────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │  Supabase Cloud                        │
    │  - PostgreSQL Database                 │
    │  - Auth Service                        │
    │  - Realtime Subscriptions              │
    │  - Row Level Security (RLS)            │
    └───────────────────────────────────────┘
```

## Data Flow Example

### Adding a Task

```
User types task
    ↓
ActivityInput component emits onAdd
    ↓
App.handleAddTask calls categorizeTask (Gemini API)
    ↓
App.handleAddTask calls addTask(text, quadrant) from useTasks hook
    ↓
useTasks makes INSERT into Supabase tasks table
    ↓
Supabase RLS policy checks auth.uid() = user_id (passes)
    ↓
Task inserted into database
    ↓
Realtime event published to all subscribers
    ↓
useTasks realtime listener receives INSERT event
    ↓
React state updated with new task
    ↓
EisenhowerMatrix component re-renders
    ↓
Task visible in appropriate quadrant
    ↓
Realtime event sent to other tabs/devices
    ↓
Other tabs receive event and update automatically
```

## Next Steps

After setup is working:

1. **Add Email Verification** - Require confirmed email before login
2. **Add Social Auth** - Google/GitHub sign-in
3. **Password Reset** - Email-based password recovery
4. **Task Sharing** - Share matrices between users
5. **Offline Support** - IndexedDB + sync queue for offline work
6. **Mobile App** - React Native with same Supabase backend

## Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review browser console for error messages
3. Visit Supabase documentation: https://supabase.com/docs
4. Check project logs in Supabase dashboard > Logs

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
