# Eisenhower AI Matrix - System Architecture

## Overview

The Eisenhower AI Matrix is a task prioritization web application built with React 19 and TypeScript. It uses Google Gemini AI to automatically categorize tasks into four quadrants based on urgency and importance, and integrates with WhatsApp via UAZAPI for seamless task sharing.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (Client-Side SPA)                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Application                     │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │                   App.tsx                        │   │   │
│  │  │  - State Management (hooks)                     │   │   │
│  │  │  - Event Handlers                              │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │              Components Layer                    │   │   │
│  │  │  ├─ ActivityInput.tsx (task input form)         │   │   │
│  │  │  ├─ EisenhowerMatrix.tsx (matrix display)       │   │   │
│  │  │  └─ Auth/Login.tsx (authentication)             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │              Contexts & Hooks                    │   │   │
│  │  │  ├─ AuthContext.tsx (auth state)                │   │   │
│  │  │  ├─ useTasks.ts (task management)               │   │   │
│  │  │  ├─ useUserConfig.ts (user configuration)       │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │            Services Layer                        │   │   │
│  │  │  ├─ geminiService.ts (AI categorization)        │   │   │
│  │  │  └─ supabaseClient.ts (database client)         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Local Storage Persistence                  │   │
│  │  - Tasks data                                           │   │
│  │  - User configuration                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ Gemini API   │  │ Supabase     │  │ UAZAPI       │
  │ (Google)     │  │ (Database)   │  │ (WhatsApp)   │
  │              │  │              │  │              │
  │ Task         │  │ Authentication│  │ Task sharing │
  │ categorization│  │ & Data Store  │  │              │
  └──────────────┘  └──────────────┘  └──────────────┘
```

## Component Structure

### Core Components

1. **App.tsx** - Main application component
   - Manages global state (tasks, config, UI state)
   - Handles task lifecycle (add, delete, update)
   - Coordinates between sub-components
   - Manages toast notifications and modals

2. **ActivityInput.tsx** - Task input form
   - User input field for new tasks
   - Form submission handling
   - Loading state display

3. **EisenhowerMatrix.tsx** - 2×2 matrix display
   - Renders 4 quadrant boxes
   - Displays tasks by quadrant
   - Drag-and-drop task management (future)

4. **Auth/Login.tsx** - Authentication form
   - Email/password login
   - Error messaging
   - Loading states

### Context & Hooks

1. **AuthContext.tsx**
   - Provides authentication state
   - User session management
   - Sign-out functionality
   - Supabase integration

2. **useTasks.ts**
   - Task CRUD operations
   - Supabase queries
   - Local state management
   - Error handling

3. **useUserConfig.ts**
   - UAZAPI configuration storage
   - User preferences
   - Supabase user_config table integration

### Services

1. **geminiService.ts**
   - Google Gemini API integration
   - Task categorization logic
   - JSON schema validation
   - Error fallback (defaults to DO quadrant)

2. **supabaseClient.ts**
   - Supabase client initialization
   - Environment variable loading
   - Type definitions for database schema

## Data Flow

### Task Creation Flow

```
User Input
    ↓
ActivityInput.tsx (form submission)
    ↓
App.tsx (handleAddTask)
    ↓
geminiService.ts (categorizeTask)
    ↓
Google Gemini API
    ↓
Quadrant category (DO | SCHEDULE | DELEGATE | ELIMINATE)
    ↓
useTasks.ts (addTask)
    ↓
Supabase: INSERT into tasks table
    ↓
Task added to state
    ↓
EisenhowerMatrix.tsx (re-renders with new task)
```

### WhatsApp Sharing Flow

```
User clicks "Send to WhatsApp"
    ↓
App.tsx (sendToWhatsApp)
    ↓
formatMatrixForWhatsApp() - Format tasks as markdown
    ↓
Fetch to UAZAPI endpoint
    ↓
UAZAPI forwards to WhatsApp
    ↓
Toast notification (success/error)
```

### Authentication Flow

```
User login form
    ↓
AuthContext.tsx
    ↓
Supabase Auth.signInWithPassword()
    ↓
Session created / Error
    ↓
useAuth() hook updates context
    ↓
App component conditional render
```

## State Management

### Global State (App.tsx)

```typescript
// UI State
const [loading, setLoading] = useState(false); // AI categorization
const [sending, setSending] = useState(false); // WhatsApp send
const [error, setError] = useState<string | null>(null); // Error messages
const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings modal
const [showTips, setShowTips] = useState(false); // Tips display
const [apiLastError, setApiLastError] = useState<number | null>(null); // API errors
const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'online' | 'offline'>(
  'unknown'
);

// Toast notifications
const [toast, setToast] = useState<ToastState>({
  message: '',
  type: 'info',
  visible: false,
});
```

### Hook-based State

**useTasks**: Tasks array with CRUD operations
**useUserConfig**: UAZAPI settings (token, phone number, URL)
**useAuth**: User session and authentication state

### Persistence

- Tasks and config stored in browser localStorage
- Synced with Supabase database for multi-device access
- Local storage serves as fallback if offline

## Type System

### Core Types (types.ts)

```typescript
enum Quadrant {
  DO = 'DO', // Urgent & Important
  SCHEDULE = 'SCHEDULE', // Important, Not Urgent
  DELEGATE = 'DELEGATE', // Urgent, Not Important
  ELIMINATE = 'ELIMINATE', // Neither urgent nor important
}

interface Task {
  id: string;
  user_id: string;
  text: string;
  quadrant: Quadrant;
  created_at: string;
  updated_at: string;
}

interface UserConfig {
  user_id: string;
  uazapi_url: string;
  uazapi_token: string | null;
  uazapi_number: string;
  created_at: string;
  updated_at: string;
}
```

### Database Types (types/database.types.ts)

Auto-generated from Supabase schema with full TypeScript support for:

- tasks table
- user_config table
- Enum types for quadrants

## API Integrations

### Google Gemini API

**Purpose**: Task categorization
**Endpoint**: Google Generative AI SDK (@google/genai)
**Model**: gemini-3-flash-preview
**Request**: Task description (Portuguese)
**Response**: JSON with quadrant classification

**Error Handling**: Falls back to DO quadrant if parsing fails

### Supabase

**Purpose**: Authentication, database, storage
**Services Used**:

- Auth: Email/password authentication
- Database: tasks and user_config tables
- Real-time: Optional subscription to task changes

**Connection**: Environment variables

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (backend only)

### UAZAPI

**Purpose**: WhatsApp task sharing
**Endpoint**: https://free.uazapi.com/send/text
**Authentication**: Token in header
**Payload**: Message text and destination phone number
**Error Codes**:

- 401: Invalid token
- 503: WhatsApp disconnected

## Build & Deployment

### Build Process

- **Tool**: Vite
- **Target**: ES2022
- **Output**: dist/ directory
- **Bundle Size**: ~869KB (minified), ~222KB (gzipped)

### Environment Variables

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Development Server

- **Port**: 3000
- **Hot Reload**: Enabled via Vite
- **Preview**: `npm run preview` for production build testing

## Performance Considerations

1. **API Calls**: Each task categorization makes a Gemini API call (potential bottleneck)
2. **Bundle Size**: Large due to Supabase and Google Gemini SDKs
3. **State Management**: All state in memory; no persistence during session
4. **Database Queries**: Real-time sync can be expensive at scale

## Security Architecture

1. **Frontend Security**:
   - API keys stored in environment variables
   - No sensitive data in localStorage (except UAZAPI token - user owns risk)
   - CORS configured for Gemini and UAZAPI

2. **Backend Security** (via Supabase):
   - Row-level security (RLS) on tables
   - User isolation via user_id column
   - API keys kept server-side

3. **Authentication**:
   - Supabase Auth handles session management
   - JWT tokens for request signing
   - HTTPS-only communication

## Scalability

### Current Limitations

- Single user per browser session
- All state in memory
- No background jobs
- No caching of categorizations
- No rate limiting on Gemini API

### Future Improvements

- Batch task categorization
- Result caching layer
- WebSocket for real-time updates
- Service Worker for offline support
- IndexedDB for larger datasets

## Testing Strategy

### Test Coverage Areas

1. **Unit Tests**: Service functions (categorization, formatting)
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Full user workflows (add, share, manage tasks)

### Testing Tools

- Vitest: Unit and integration testing
- @vitest/ui: Visual test runner
- jsdom: DOM simulation
- React Testing Library: Component testing

## Monitoring & Debugging

### Available Logs

- Browser console for API responses
- Network tab for API calls
- Redux DevTools for state inspection (if added)
- Error boundaries for crash detection

### Debug Mode

Set `console.log` in:

- geminiService.ts: See Gemini API responses
- useTasks.ts: Track database operations
- useAuth.ts: Monitor authentication flow

## Future Enhancements

1. **Task Collaboration**: Multiple users per workspace
2. **Advanced Scheduling**: Calendar integration
3. **Analytics**: Task completion statistics
4. **Export**: PDF/CSV reports
5. **Mobile App**: React Native version
6. **Offline Mode**: Full offline capability with sync
7. **Custom Categories**: User-defined quadrants
8. **Integrations**: Calendar, email, Slack

---

**Last Updated**: 2026-01-28
**Architecture Version**: 1.0
