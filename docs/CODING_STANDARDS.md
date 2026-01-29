# Coding Standards - Eisenhower AI Matrix

## Overview

This document outlines the coding standards, best practices, and conventions for the Eisenhower AI Matrix project. All developers must follow these standards to maintain code quality and consistency.

## Table of Contents

1. [TypeScript Standards](#typescript-standards)
2. [React Conventions](#react-conventions)
3. [Code Style](#code-style)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [Error Handling](#error-handling)
7. [Comments & Documentation](#comments--documentation)
8. [Testing Standards](#testing-standards)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Guidelines](#security-guidelines)

## TypeScript Standards

### Type Definitions

1. **Always define types explicitly**

   ```typescript
   // Good
   const addTask = async (text: string, quadrant: Quadrant): Promise<void> => {
     // ...
   };

   // Bad
   const addTask = async (text, quadrant) => {
     // ...
   };
   ```

2. **Use interfaces for object shapes**

   ```typescript
   // Good
   interface Task {
     id: string;
     text: string;
     quadrant: Quadrant;
     createdAt: string;
   }

   // Bad
   type Task = {
     id: string;
     text: string;
     quadrant: Quadrant;
     createdAt: string;
   };
   ```

3. **Avoid `any` types**

   ```typescript
   // Good
   try {
     // ...
   } catch (error: Error) {
     console.error('Error:', error.message);
   }

   // Bad
   try {
     // ...
   } catch (err: any) {
     console.error('Error:', err);
   }
   ```

4. **Use discriminated unions for complex types**

   ```typescript
   // Good
   type Result = { status: 'success'; data: Task[] } | { status: 'error'; message: string };

   // Bad
   type Result = { status?: string; data?: Task[]; message?: string };
   ```

### Generics

Use generics for reusable utility functions:

```typescript
// Good
function useApi<T>(endpoint: string): Promise<T> {
  // ...
}

// Usage
const tasks = await useApi<Task[]>('/api/tasks');
```

## React Conventions

### Functional Components

Always use functional components with hooks:

```typescript
// Good
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<string>('');

  return <div>{state}</div>;
};

export default MyComponent;

// Bad
class MyComponent extends React.Component {
  // ...
}
```

### Hooks

1. **Always place hooks at the top level**

   ```typescript
   // Good
   const Component: React.FC = () => {
     const [state, setState] = useState(false);
     const memoValue = useMemo(() => expensiveCalculation(), []);

     if (condition) {
       return <div>Error</div>;
     }

     return <div>{memoValue}</div>;
   };

   // Bad
   const Component: React.FC = () => {
     if (condition) {
       const [state, setState] = useState(false); // Hook in conditional!
     }

     return <div></div>;
   };
   ```

2. **Name hooks with `use` prefix**

   ```typescript
   // Good
   export const useTasks = () => {
     // ...
   };

   // Bad
   export const getTasks = () => {
     // ...
   };
   ```

3. **Document hook dependencies**

   ```typescript
   // Good
   useEffect(() => {
     fetchData();
     // Effect runs when userId changes
   }, [userId]);

   // Bad
   useEffect(() => {
     fetchData();
     // Effect runs on every render!
   }, []);
   ```

### Component Props

```typescript
// Good
interface ActivityInputProps {
  onAdd: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ onAdd, isLoading }) => {
  // ...
};

// Bad
const ActivityInput = ({ onAdd, isLoading }: any) => {
  // ...
};
```

## Code Style

### Formatting

Use Prettier for automatic code formatting. Configuration in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Line Length

Keep lines under 100 characters for readability:

```typescript
// Good
const longVariableName = calculateComplexValue(param1, param2, param3);

// Bad
const longVariableName = calculateComplexValue(param1, param2, param3, param4, param5, param6);
```

### Semicolons

Always include semicolons:

```typescript
// Good
const x = 5;
const fn = () => x;

// Bad
const x = 5
const fn = () => x
```

### Quotes

Use single quotes for strings:

```typescript
// Good
const message = 'Hello, World!';

// Bad
const message = "Hello, World!";
```

## Naming Conventions

### Variables & Constants

Use camelCase for variables and constants:

```typescript
// Good
const maxRetries = 3;
let taskCount = 0;
const getUserName = () => {};

// Bad
const MAX_RETRIES = 3; // Use for never-changing constants only
let TaskCount = 0;
const get_user_name = () => {};
```

### Constants

Use UPPER_SNAKE_CASE only for truly constant values:

```typescript
// Good
export const DEFAULT_TIMEOUT = 5000;
export const API_BASE_URL = 'https://api.example.com';

// Bad
const defaultTimeout = 5000; // Should be uppercase if truly constant
```

### Functions

Use camelCase and descriptive verbs:

```typescript
// Good
const addTask = () => {};
const fetchUserTasks = () => {};
const handleTaskDelete = () => {};
const isTaskValid = () => {};

// Bad
const add = () => {};
const userTasks = () {};
const delete_task = () => {};
const task_valid = () => {};
```

### React Components

Use PascalCase:

```typescript
// Good
const ActivityInput: React.FC = () => {};
const EisenhowerMatrix: React.FC = () => {};

// Bad
const activity_input: React.FC = () => {};
const eisenhower_matrix: React.FC = () => {};
```

### Event Handlers

Use `handle` prefix:

```typescript
// Good
const handleAddTask = () => {};
const handleDeleteTask = () => {};
const handleInputChange = () => {};

// Bad
const addTask = () => {}; // Ambiguous - function or event handler?
const onDeleteTask = () => {}; // `on` is for event names
```

## File Organization

### Directory Structure

```
project/
├── components/          # React components
│   ├── ActivityInput.tsx
│   ├── EisenhowerMatrix.tsx
│   └── Auth/
│       └── Login.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── hooks/               # Custom hooks
│   ├── useTasks.ts
│   └── useUserConfig.ts
├── lib/                 # Utilities & services
│   └── supabaseClient.ts
├── types/               # TypeScript types
│   ├── database.types.ts
│   └── index.ts
├── services/            # Business logic
│   └── geminiService.ts
├── styles/              # Global styles
│   └── index.css
├── App.tsx
├── index.tsx
└── types.ts
```

### File Naming

1. **Components**: PascalCase with `.tsx` extension
   ```typescript
   ActivityInput.tsx
   EisenhowerMatrix.tsx
   ```

2. **Hooks**: camelCase with `.ts` extension
   ```typescript
   useTasks.ts
   useUserConfig.ts
   ```

3. **Services**: camelCase with `.ts` extension
   ```typescript
   geminiService.ts
   supabaseClient.ts
   ```

4. **Types**: camelCase with `.ts` extension
   ```typescript
   database.types.ts
   ```

## Error Handling

### Try-Catch Blocks

Always catch specific error types:

```typescript
// Good
try {
  await fetchData();
} catch (error: Error) {
  console.error('Failed to fetch data:', error.message);
  throw new Error(`Data fetch failed: ${error.message}`);
} finally {
  setLoading(false);
}

// Bad
try {
  await fetchData();
} catch (err: any) {
  console.error(err);
}
```

### Error Messages

Provide context in error messages:

```typescript
// Good
throw new Error('Failed to add task: Invalid quadrant value');

// Bad
throw new Error('Error');
```

### Promise Rejection

Always handle rejected promises:

```typescript
// Good
const handleAddTask = async (text: string) => {
  try {
    await addTask(text);
  } catch (error) {
    showToast('Failed to add task', 'error');
  }
};

// Bad
const handleAddTask = async (text: string) => {
  addTask(text).then(/* ... */); // Unhandled rejection
};
```

## Comments & Documentation

### Comment Guidelines

1. **Explain "why", not "what"**

   ```typescript
   // Good
   // Retry logic: API sometimes returns 503 during database migrations
   if (response.status === 503) {
     return retry(request);
   }

   // Bad
   // Check if response status is 503
   if (response.status === 503) {
     return retry(request);
   }
   ```

2. **Use JSDoc for public functions**

   ```typescript
   /**
    * Categorizes a task into an Eisenhower Matrix quadrant
    * @param taskText - The task description
    * @returns The quadrant category (DO, SCHEDULE, DELEGATE, ELIMINATE)
    * @throws Error if Gemini API call fails
    */
   export const categorizeTask = async (taskText: string): Promise<Quadrant> => {
     // ...
   };
   ```

3. **TODO comments**

   ```typescript
   // TODO: Implement caching for task categorization (Issue #123)
   // FIXME: Handle edge case where quadrant is undefined
   // NOTE: This is a workaround for Supabase client issue
   ```

## Testing Standards

### Test File Naming

Place tests adjacent to source files with `.test.ts` or `.test.tsx` suffix:

```
components/
├── ActivityInput.tsx
├── ActivityInput.test.tsx
└── EisenhowerMatrix.tsx
```

### Test Structure

```typescript
describe('ActivityInput', () => {
  let mockOnAdd: jest.Mock;

  beforeEach(() => {
    mockOnAdd = jest.fn();
  });

  it('should call onAdd with text when form is submitted', () => {
    // Arrange
    const { getByRole } = render(<ActivityInput onAdd={mockOnAdd} isLoading={false} />);

    // Act
    userEvent.type(getByRole('textbox'), 'New task');
    userEvent.click(getByRole('button'));

    // Assert
    expect(mockOnAdd).toHaveBeenCalledWith('New task');
  });
});
```

### Test Coverage Goals

- Minimum 80% code coverage
- 100% coverage for critical paths (authentication, data mutations)
- All public APIs tested
- Edge cases covered

## Performance Guidelines

### Memoization

Use memoization for expensive computations:

```typescript
// Good
const MemoizedComponent = React.memo(MyComponent);

const memoValue = useMemo(() => expensiveCalculation(data), [data]);

const memoCallback = useCallback(() => handleClick(), [dependency]);

// Bad
const MemoizedComponent = MyComponent; // Not memoized

const value = expensiveCalculation(data); // Recalculated every render
```

### Component Optimization

```typescript
// Good
const TaskList: React.FC<Props> = React.memo(({ tasks }) => {
  return tasks.map((task) => (
    <TaskItem key={task.id} task={task} />
  ));
});

// Bad
const TaskList: React.FC<Props> = ({ tasks }) => {
  return tasks.map((task, index) => (
    <TaskItem key={index} task={task} /> // Avoid index as key!
  ));
};
```

## Security Guidelines

### Sensitive Data

Never log or expose sensitive data:

```typescript
// Good
console.log('Authentication successful');
// Don't log tokens or passwords

// Bad
console.log('Token:', authToken);
console.log('Password:', password);
```

### Input Validation

Always validate and sanitize user input:

```typescript
// Good
const addTask = (text: string) => {
  if (!text.trim()) {
    throw new Error('Task text cannot be empty');
  }
  // ...
};

// Bad
const addTask = (text: string) => {
  // No validation
};
```

### Dependency Updates

Keep dependencies updated and audit for vulnerabilities:

```bash
npm audit
npm update
```

---

**Last Updated**: 2026-01-28
**Standards Version**: 1.0
