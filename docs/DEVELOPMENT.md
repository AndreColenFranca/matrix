# Development Guide - Eisenhower AI Matrix

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Git
- A modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/eisenhower-ai-matrix.git
   cd eisenhower-ai-matrix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**

   Edit `.env.local` and add:

   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   Application opens at `http://localhost:3000`

## Available Commands

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm run preview      # Preview production build locally
```

### Code Quality

```bash
npm run lint         # Check code style
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
npm run typecheck    # TypeScript type checking
```

### Testing

```bash
npm run test         # Run all tests
npm run test:ui      # Interactive test runner UI
npm run test:coverage # Generate coverage report
```

### Integrated Quality Gate

```bash
npm run quality-gate # Run all checks: typecheck, lint, format, build
```

## Environment Variables

### Required Variables

| Variable                 | Description                  | Source                                       |
| ------------------------ | ---------------------------- | -------------------------------------------- |
| `VITE_GEMINI_API_KEY`    | Google Generative AI API key | [ai.google.dev](https://ai.google.dev)       |
| `VITE_SUPABASE_URL`      | Supabase project URL         | [app.supabase.com](https://app.supabase.com) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key   | Supabase dashboard                           |

### Optional Variables

| Variable                    | Description                                |
| --------------------------- | ------------------------------------------ |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend-only Supabase key (for migrations) |
| `NODE_ENV`                  | Set to `development` or `production`       |

## Project Structure

```
project/
├── .github/
│   └── workflows/           # CI/CD workflows
│       ├── quality-gate.yml # Linting, type checking, build
│       └── tests.yml        # Test execution
├── components/
│   ├── ActivityInput.tsx    # Task input form
│   ├── EisenhowerMatrix.tsx # Matrix display
│   └── Auth/
│       └── Login.tsx        # Authentication
├── contexts/
│   └── AuthContext.tsx      # Global auth state
├── hooks/
│   ├── useTasks.ts          # Task management
│   └── useUserConfig.ts     # User settings
├── lib/
│   └── supabaseClient.ts    # Supabase client
├── types/
│   ├── database.types.ts    # Database types
│   └── index.ts             # Shared types
├── docs/
│   ├── ARCHITECTURE.md      # System design
│   ├── CODING_STANDARDS.md  # Code conventions
│   └── DEVELOPMENT.md       # This file
├── App.tsx                  # Main component
├── index.tsx                # React entry point
├── types.ts                 # Core type definitions
├── geminiService.ts         # AI service
└── vite.config.ts          # Vite configuration
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:

- `feature/` - New feature
- `bugfix/` - Bug fix
- `docs/` - Documentation
- `refactor/` - Code refactoring

### 2. Make Changes

```bash
# Edit files, add features
# Keep changes focused and atomic
```

### 3. Run Quality Checks

```bash
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run typecheck     # Type checking
npm run test          # Run tests
npm run build         # Build verification
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add task filtering by quadrant"
```

Commit message format:

```
<type>: <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create PR on GitHub with:

- Clear description of changes
- Link to related issues
- Testing instructions
- Screenshots (if UI changes)

## Common Development Tasks

### Adding a New Component

1. **Create component file** in `components/`

   ```typescript
   // components/NewComponent.tsx
   interface NewComponentProps {
     prop1: string;
     prop2?: number;
   }

   export const NewComponent: React.FC<NewComponentProps> = ({ prop1, prop2 = 0 }) => {
     return <div>{prop1}</div>;
   };
   ```

2. **Create test file**

   ```typescript
   // components/NewComponent.test.tsx
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import { NewComponent } from './NewComponent';

   describe('NewComponent', () => {
     it('should render', () => {
       render(<NewComponent prop1="test" />);
       expect(screen.getByText('test')).toBeInTheDocument();
     });
   });
   ```

3. **Export from component barrel**

   Update `components/index.ts` if it exists, or export directly.

4. **Import in parent component**

   ```typescript
   import { NewComponent } from './components/NewComponent';
   ```

### Adding a New Hook

1. **Create hook file** in `hooks/`

   ```typescript
   // hooks/useMyHook.ts
   import { useState, useCallback } from 'react';

   interface UseMyHookResult {
     value: string;
     setValue: (val: string) => void;
   }

   export const useMyHook = (): UseMyHookResult => {
     const [value, setValue] = useState<string>('');

     return { value, setValue };
   };
   ```

2. **Add TypeScript documentation**

   ```typescript
   /**
    * Custom hook for managing my feature
    * @returns Object with value and setter
    */
   export const useMyHook = (): UseMyHookResult => {
     // ...
   };
   ```

3. **Use in components**

   ```typescript
   const MyComponent: React.FC = () => {
     const { value, setValue } = useMyHook();
     // ...
   };
   ```

### Modifying API Integration

1. **Update service function** in `geminiService.ts` or new service file

   ```typescript
   export const newApiCall = async (param: string): Promise<Result> => {
     try {
       const response = await fetch('https://api.example.com/endpoint', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ param }),
       });

       if (!response.ok) {
         throw new Error(`API error: ${response.status}`);
       }

       return response.json();
     } catch (error) {
       console.error('API call failed:', error);
       throw error;
     }
   };
   ```

2. **Add error handling in component**

   ```typescript
   const handleApiCall = async () => {
     setLoading(true);
     try {
       const result = await newApiCall('value');
       showToast('Success!', 'success');
     } catch (error) {
       showToast('Failed to call API', 'error');
     } finally {
       setLoading(false);
     }
   };
   ```

### Adding Database Schema Changes

1. **Create migration** in Supabase dashboard

   Or use SQL migration file:

   ```sql
   -- migrations/001_add_feature.sql
   ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 1;
   ```

2. **Update types**

   ```typescript
   // types/database.types.ts
   export type Database = {
     public: {
       Tables: {
         tasks: {
           Row: {
             // ... existing fields
             priority: number;
           };
           Insert: {
             // ... existing fields
             priority?: number;
           };
           Update: {
             // ... existing fields
             priority?: number;
           };
         };
       };
     };
   };
   ```

3. **Update hooks**

   ```typescript
   // hooks/useTasks.ts
   const addTask = useCallback(
     async (text: string, quadrant: Quadrant, priority: number = 1) => {
       // ... implementation
     },
     [user]
   );
   ```

## Debugging

### Browser DevTools

1. **Open DevTools**: F12 or Right-click → Inspect
2. **Console**: View logs and errors
3. **Network**: Monitor API calls
4. **Application**: Check localStorage and IndexedDB

### Debugging API Calls

Add console.log before/after API calls:

```typescript
console.log('Calling Gemini API with task:', taskText);
const result = await categorizeTask(taskText);
console.log('Gemini response:', result);
```

### React DevTools

Install React DevTools browser extension to inspect component state and props.

### Vite HMR

Hot Module Replacement works automatically:

- Save files to see changes instantly
- State is preserved during refresh
- Perfect for UI development

## Performance Profiling

### Build Size Analysis

```bash
npm run build -- --report
```

Use plugins like `rollup-plugin-visualizer` to analyze bundle size.

### Runtime Performance

Use React DevTools Profiler tab to:

- Record component render times
- Identify performance bottlenecks
- Optimize re-renders

## Troubleshooting

### Issue: "Cannot find module"

**Solution**:

```bash
npm install
npm run typecheck # Check for type errors
```

### Issue: Environment variables not loading

**Solution**:

1. Verify file is named `.env.local` (not `.env`)
2. Restart dev server: `npm run dev`
3. Check `vite.config.ts` for env loading config

### Issue: TypeScript errors after dependency update

**Solution**:

```bash
npm install
npm run typecheck
# Review and fix type errors
```

### Issue: Tests failing after changes

**Solution**:

```bash
npm run test          # Run tests
npm run test:ui       # Run with UI for debugging
# Update test snapshots if needed
npm run test -- -u
```

### Issue: Build fails

**Solution**:

```bash
npm run lint:fix      # Fix linting
npm run format        # Format code
npm run typecheck     # Check types
npm run build         # Try building again
```

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/task-filtering
```

### Keep Branch Updated

```bash
git fetch origin
git rebase origin/main
```

### Squash Commits Before PR

```bash
git rebase -i origin/main
# Mark commits as 'squash' except the first one
```

### Push to Remote

```bash
git push origin feature/task-filtering
```

## CI/CD Pipeline

### Automated Checks on Push

1. **Quality Gate** (quality-gate.yml)
   - TypeScript type checking
   - ESLint code style
   - Prettier formatting
   - Build verification

2. **Tests** (tests.yml)
   - Run test suite
   - Generate coverage
   - Upload to Codecov

### Pull Request Status

All checks must pass before merging:

- Green checkmarks on required checks
- Code review approval
- No merge conflicts

## Resources

### Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)

### Tools

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Vitest Documentation](https://vitest.dev/)

### Community

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Pull Requests: Contribute improvements

---

**Last Updated**: 2026-01-28
**Version**: 1.0
