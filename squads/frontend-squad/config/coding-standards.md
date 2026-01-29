# Frontend Coding Standards

## React & TypeScript

### Component Structure

```typescript
import React from 'react';
import type { FC, ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, children, onClick }) => {
  return (
    <div className="...">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

### Naming Conventions

- Components: PascalCase (`ActivityInput.tsx`)
- Files: Match component name
- Props interface: `ComponentNameProps`
- Hooks: camelCase with `use` prefix

### Tailwind CSS Guidelines

- Use utility classes directly (no CSS files)
- Color scheme:
  - Primary: `indigo` (buttons, links)
  - DO quadrant: `red`
  - SCHEDULE quadrant: `blue`
  - DELEGATE quadrant: `amber`
  - ELIMINATE quadrant: `slate`
- Responsive: mobile-first (sm:, md:, lg:)

## Testing

- Write tests alongside components
- Use React Testing Library patterns
- Test user interactions, not implementation

## Accessibility

- Include alt text for images
- Use semantic HTML
- ARIA labels for custom controls
- Keyboard navigation support

## Code Quality

- ESLint: Must pass before commit
- Prettier: Automatic formatting
- TypeScript: Strict mode enabled
