# Brownfield Discovery - Architecture Overview

## Project Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        EISENHOWER AI MATRIX APP                         │
│                         (React 19 SPA - Vite)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    USER INTERFACE LAYER                         │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │  │
│  │  │  ActivityInput  │  │ EisenhowerMatrix │  │   Auth/Login    │ │  │
│  │  │    Component    │  │    Component     │  │   Component     │ │  │
│  │  │   (46 LOC)      │  │    (153 LOC)     │  │   (191 LOC)     │ │  │
│  │  └─────────────────┘  └──────────────────┘  └─────────────────┘ │  │
│  │         │                      │                     │            │  │
│  └─────────┼──────────────────────┼─────────────────────┼────────────┘  │
│            │                      │                     │               │
│  ┌─────────▼──────────────────────▼─────────────────────▼────────────┐  │
│  │                   STATE MANAGEMENT LAYER                         │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │                                                                   │  │
│  │  ┌──────────────────┐      ┌──────────────────┐                  │  │
│  │  │  AuthContext.tsx │      │   App.tsx (Main) │                  │  │
│  │  │  (React Context) │      │  State Manager   │                  │  │
│  │  │   (243 LOC)      │      │  (323 LOC)       │                  │  │
│  │  └──────────────────┘      └──────────────────┘                  │  │
│  │         │                           │                            │  │
│  │    Global Auth State        Local Component State               │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│            │                           │                                │
│  ┌─────────▼───────────────────────────▼────────────────────────────┐   │
│  │               HOOKS & SERVICES LAYER (Logic)                    │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │   │
│  │  │ useTasks.ts  │  │useUserConfig │  │ geminiService.ts     │ │   │
│  │  │              │  │              │  │                      │ │   │
│  │  │ Hook (Task   │  │ Hook (Config)│  │ Service (Gemini API) │ │   │
│  │  │ Management)  │  │              │  │                      │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │   │
│  │      (91 LOC)         (71 LOC)            (46 LOC)              │   │
│  │         │                 │                    │                │   │
│  └─────────┼─────────────────┼────────────────────┼────────────────┘   │
│            │                 │                    │                     │
│  ┌─────────▼─────────────────▼────────────────────▼────────────────┐   │
│  │           DATA & PERSISTENCE LAYER                              │   │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │                                                                   │  │
│  │  ┌──────────────────────┐  ┌────────────────────────────────┐  │  │
│  │  │ supabaseClient.ts    │  │  Browser localStorage          │  │  │
│  │  │ (Supabase SDK Init)  │  │  (Local Persistence)           │  │  │
│  │  │ (95 LOC)             │  │  (Immediate Cache)             │  │  │
│  │  └──────────────────────┘  └────────────────────────────────┘  │  │
│  │         │                              │                        │  │
│  │   Real-time Sync                  Fast Access                  │  │
│  │                                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│            │                              │                             │
└────────────┼──────────────────────────────┼─────────────────────────────┘
             │                              │
             │                              │
┌────────────▼──────────────────────────────▼─────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │  Google Gemini API   │  │   Supabase Cloud     │  │  UAZAPI      │ │
│  │  (Task Categorization)   │   (Database & Auth)  │  │ (WhatsApp)   │ │
│  │                      │  │                      │  │              │ │
│  │ gemini-3-flash       │  │ PostgreSQL Database  │  │ HTTP Endpoint│ │
│  │                      │  │ Email Auth           │  │              │ │
│  │ Schema-based JSON    │  │ Row-Level Security   │  │ Token Auth   │ │
│  │ Response             │  │ Real-time Replication   │ Phone#: Config│ │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘ │
│         │                           │                      │            │
└─────────┼───────────────────────────┼──────────────────────┼────────────┘
          │                           │                      │
          ▼                           ▼                      ▼
   [HTTPS API]                  [HTTPS API]           [HTTPS API]
   Categorize Task         Multi-user Data         Share via WhatsApp
```

## Data Flow Diagram

```
USER INPUT
    │
    ▼
┌─────────────────────┐
│ ActivityInput.tsx   │
│ (Get Task Text)     │
└─────────────────────┘
    │
    ▼
┌─────────────────────────────────────┐
│ App.tsx handleAddTask()             │
│ 1. Call geminiService.categorizeTask│
└─────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ geminiService.ts                      │
│ → Send to Google Gemini API          │
│ → Parse JSON response                │
│ → Extract quadrant (DO/SCHEDULE/etc) │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ App.tsx State Update                  │
│ setTasks([...tasks, newTask])        │
│ localStorage.setItem('tasks', ...)   │
└──────────────────────────────────────┘
    │
    ┌─────────────────────────────────┬──────────────────────────────┐
    │                                 │                              │
    ▼                                 ▼                              ▼
┌──────────────────┐  ┌──────────────────────────┐  ┌─────────────────────┐
│ Browser Storage  │  │ supabaseClient.upsert()  │  │ EisenhowerMatrix    │
│ (Cached copy)    │  │ (Cloud sync)             │  │ Re-render with task │
└──────────────────┘  └──────────────────────────┘  └─────────────────────┘
```

## Component Dependency Tree

```
App.tsx (Root - 323 LOC)
├── AuthContext.Provider (243 LOC)
│   ├── Header UI
│   │   ├── Clear Tasks button
│   │   ├── Settings button
│   │   └── Connection status
│   │
│   ├── ActivityInput.tsx (46 LOC)
│   │   └── Form Input + Submit Button
│   │
│   ├── EisenhowerMatrix.tsx (153 LOC)
│   │   ├── QuadrantBox - DO (red)
│   │   ├── QuadrantBox - SCHEDULE (blue)
│   │   ├── QuadrantBox - DELEGATE (amber)
│   │   └── QuadrantBox - ELIMINATE (slate)
│   │
│   ├── Auth/Login.tsx (191 LOC)
│   │   └── Supabase Auth Modal
│   │
│   └── Toast Notification System
│       └── Success/Error/Info messages
│
└── Custom Hooks (used in components)
    ├── useTasks (91 LOC)
    │   ├── Fetch from Supabase
    │   ├── Add task
    │   ├── Delete task
    │   └── Clear all tasks
    │
    └── useUserConfig (71 LOC)
        ├── Fetch user config
        ├── Update UAZAPI settings
        └── Get connection status
```

## State Shape (TypeScript Types)

```typescript
// Quadrant enum - defined in types.ts
enum Quadrant {
  DO = 'DO', // Urgent & Important
  SCHEDULE = 'SCHEDULE', // Not Urgent & Important
  DELEGATE = 'DELEGATE', // Urgent & Not Important
  ELIMINATE = 'ELIMINATE', // Not Urgent & Not Important
}

// Task interface - matches Supabase schema
interface Task {
  id: string; // UUID from Supabase
  user_id: string; // Owner of task
  text: string; // Task description
  quadrant: Quadrant; // AI-assigned category
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// User configuration
interface UserConfig {
  user_id: string;
  uazapi_url: string; // WhatsApp API endpoint
  uazapi_token: string; // Authentication token
  uazapi_number: string; // Destination phone number
  created_at: string;
  updated_at: string;
}

// Main app state
interface EisenhowerState {
  tasks: Task[];
  loading: boolean; // AI categorization in progress
  error: string | null;
}
```

## Environment Variables Required

```
# Google Generative AI
VITE_GEMINI_API_KEY=your_google_api_key

# Supabase Cloud Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_public_key

# UAZAPI (WhatsApp) - User configures in app
# (Not environment variables - user-provided in settings)
```

## Build Pipeline

```
Source Code (TypeScript + TSX)
    │
    ▼
TypeScript Compiler (tsconfig.json)
    │
    ├─ Type checking (strict mode)
    ├─ Transform JSX → React.createElement
    └─ Target ES2022
    │
    ▼
Vite Build Process
    │
    ├─ Minification
    ├─ Code splitting
    ├─ Asset optimization
    └─ Tailwind CSS compilation (from CDN at runtime)
    │
    ▼
Output: dist/ (857 KB optimized bundle)
    │
    ├─ dist/index.html (entry point)
    ├─ dist/assets/
    │   ├─ bundle.js (main code)
    │   └─ styles.css (compiled Tailwind)
    └─ dist/assets/icons (Font Awesome via CDN)
    │
    ▼
Ready for deployment:
- Static hosting (Vercel, Netlify, GitHub Pages)
- Docker container
- CDN distribution
- Edge computing (Cloudflare, Deno Deploy)
```

## Development Server Architecture

```
npm run dev
    │
    ▼
Vite Dev Server (port 3000)
    │
    ├─ Hot Module Replacement (HMR)
    ├─ Instant source map generation
    ├─ TypeScript on-the-fly compilation
    └─ Live browser reload
    │
    ├─ Source: App.tsx
    ├─ Dependencies auto-resolved
    ├─ CSS preprocessed (Tailwind from CDN)
    └─ Fast feedback loop
    │
    Browser connects to: http://localhost:3000
    │
    ├─ App loads and boots
    ├─ Components mount
    ├─ Hooks execute
    ├─ External APIs initialize:
    │   ├─ Google Gemini API (optional - requires key)
    │   ├─ Supabase client (optional - requires config)
    │   └─ localStorage restored
    │
    Ready for interaction
```

## Technology Integration Points

```
                          ┌──────────────┐
                          │ React 19 App │
                          └──────┬───────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
          ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
          │ Tailwind    │ │ TypeScript  │ │ React Router │
          │ CSS (CDN)   │ │ (Strict)    │ │ (Optional)   │
          └─────────────┘ └─────────────┘ └──────────────┘
                 │               │               │
                 ▼               ▼               ▼
          ┌─────────────────────────────────────────────┐
          │          Vite Build Tool (6.4.1)           │
          │   (HMR | Minification | Code Splitting)    │
          └─────────────────────────────────────────────┘
                          │
                          ▼
    ┌─────────────────────────────────────────────────┐
    │   RUNTIME LAYER (Browser Environment)           │
    │                                                 │
    │   ├─ DOM APIs (React renders)                  │
    │   ├─ localStorage (Task persistence)           │
    │   ├─ fetch() API (HTTP requests)               │
    │   └─ WebSocket (Supabase real-time)            │
    │                                                 │
    └─────────────────────────────────────────────────┘
                │                    │
        ┌───────┼────────────────────┼───────┐
        │       │                    │       │
        ▼       ▼                    ▼       ▼
    ┌────────────┐  ┌────────────┐ ┌──────────────┐ ┌─────────┐
    │  Google    │  │ Supabase   │ │  UAZAPI      │ │ Browser │
    │  Gemini    │  │ PostgreSQL │ │  WhatsApp    │ │ Storage │
    │  API       │  │  + Auth    │ │              │ │(Cache)  │
    └────────────┘  └────────────┘ └──────────────┘ └─────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Eisenhower AI Matrix (Deployed)            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Static Asset Hosting (one of):                        │
│  ├─ Vercel (recommended - zero config)                 │
│  ├─ Netlify (alternative)                              │
│  ├─ GitHub Pages (free)                                │
│  ├─ AWS S3 + CloudFront (scalable)                     │
│  └─ Custom server (nginx, apache)                      │
│                                                         │
│  Served files:                                         │
│  ├─ index.html (entry point)                           │
│  ├─ assets/bundle.js (main code)                       │
│  ├─ assets/styles.css (compiled styles)               │
│  └─ External CDN assets:                               │
│      ├─ Tailwind CSS (tailwindcss.com CDN)             │
│      ├─ Font Awesome (cdnjs.cloudflare.com)            │
│      └─ React via esm.sh                               │
│                                                         │
│  Backend Integration:                                  │
│  ├─ Google Cloud (Gemini API)                          │
│  ├─ Supabase (PostgreSQL + Auth)                       │
│  └─ UAZAPI (WhatsApp messaging)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Development Environment Setup

```
Local Machine
│
├─ Node.js 18+ (runtime)
├─ npm (package manager)
├─ Git (version control)
├─ VS Code (editor)
│   └─ Extensions:
│       ├─ TypeScript
│       ├─ Tailwind CSS IntelliSense
│       ├─ Prettier
│       └─ ESLint
│
├─ Project root
│   ├─ package.json (dependencies)
│   ├─ tsconfig.json (type checking)
│   ├─ vite.config.ts (build config)
│   ├─ .env (secrets - local only)
│   └─ src/ (source code)
│
└─ npm run dev
    └─ Vite dev server (http://localhost:3000)
```

## Summary: Technology Stack Overview

| Layer            | Technology            | Version  | Purpose                      |
| ---------------- | --------------------- | -------- | ---------------------------- |
| **Presentation** | React                 | 19.2.4   | UI components & rendering    |
| **Styling**      | Tailwind CSS          | 4.x      | Utility-first CSS            |
| **Icons**        | Font Awesome          | 6.4.0    | Icon library                 |
| **Language**     | TypeScript            | 5.8.2    | Type-safe development        |
| **Build Tool**   | Vite                  | 6.4.1    | Fast dev & production builds |
| **Package Mgr**  | npm                   | Latest   | Dependency management        |
| **State Mgmt**   | React Hooks + Context | 19.2.4   | App state management         |
| **Database**     | Supabase (PostgreSQL) | 2.93.2   | Cloud database & auth        |
| **AI Service**   | Google Gemini         | 1.38.0   | Task categorization          |
| **Messaging**    | UAZAPI                | HTTP API | WhatsApp integration         |

---

**Generated for Brownfield Discovery Analysis**
**Date: 2026-01-28**
