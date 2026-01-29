# Frontend Squad

React UI/UX components, Tailwind styling, and responsive design for Eisenhower AI Matrix.

## Purpose

This squad handles all frontend development for the Eisenhower Matrix application, including:

- React component development and maintenance
- Tailwind CSS styling and utility patterns
- Responsive design and accessibility
- UI/UX implementation and polish

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool

## Components

### Agents

- **Frontend Lead** - Oversees component architecture and best practices
- **Component Specialist** - Implements specific UI components

### Key Tasks

1. Create ActivityInput component (task input form)
2. Create EisenhowerMatrix component (quadrant display)
3. Implement responsive layout
4. Style with Tailwind CSS
5. Add animations and transitions
6. Implement user feedback (toast notifications)
7. Create settings modal
8. Handle accessibility (ARIA labels, keyboard navigation)

### Templates

- React component template
- Tailwind pattern library
- Form component template
- Modal component template

### Checklists

- Component quality checklist
- Responsive design checklist

## Dependencies

This squad is independent but serves as foundation for:

- AI Integration Squad (depends on this for UI)
- WhatsApp Squad (depends on this for UI)

## Quick Start

```bash
# View available tasks
ls tasks/

# Read a specific task
cat tasks/create-component.md

# Implement a task
# (assign to @dev agent)
```

## File Structure

```
frontend-squad/
├── squad.yaml              # Manifest
├── README.md              # This file
├── config/
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── tailwind-patterns.md
├── agents/
│   ├── frontend-lead.yaml
│   └── component-specialist.yaml
├── tasks/
│   ├── create-activity-input.md
│   ├── create-matrix-component.md
│   ├── responsive-layout.md
│   ├── tailwind-styling.md
│   ├── animations.md
│   ├── toast-notifications.md
│   ├── settings-modal.md
│   └── accessibility.md
├── templates/
│   ├── component-template.tsx
│   ├── tailwind-patterns.css
│   ├── form-template.tsx
│   └── modal-template.tsx
└── checklists/
    ├── component-quality.md
    └── responsive-design.md
```

## Getting Started

1. Read the coding standards in `config/coding-standards.md`
2. Review Tailwind patterns in `config/tailwind-patterns.md`
3. Pick a task from `tasks/` directory
4. Follow the task instructions
5. Validate against the appropriate checklist
