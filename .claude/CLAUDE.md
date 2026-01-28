# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This repository contains the **Eisenhower AI Matrix** project, built within the **Synkra AIOS** framework. It's a task prioritization web application that uses Google Gemini AI to categorize tasks into the Eisenhower Matrix quadrants and integrates with WhatsApp via UAZAPI.

---

## Critical Operating Rules

### NEVER
- Implement without showing options first (always use 1, 2, 3 format)
- Delete/remove content without asking first
- Delete anything created in the last 7 days without explicit approval
- Change something that was already working
- Pretend work is done when it isn't
- Process batch without validating one first
- Add features that weren't requested
- Use mock data when real data exists in database
- Explain/justify when receiving criticism (just fix it)
- Trust AI/subagent output without verification
- Create from scratch when similar exists in `squads/` or existing components

### ALWAYS
- Present options as "1. X, 2. Y, 3. Z" format
- Use `AskUserQuestion` tool for clarifications
- Check `squads/` and existing components before creating new ones
- Read COMPLETE schema before proposing database changes
- Investigate root cause when error persists
- Commit before moving to next task
- Create handoff in `docs/sessions/YYYY-MM/` at end of session

---

# Synkra AIOS Development Rules for Claude Code

You are working with Synkra AIOS, an AI-Orchestrated System for Full Stack Development.

## Core Framework Understanding

Synkra AIOS is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.

## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aios-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction

## Development Methodology

### Story-Driven Development
1. **Work from stories** - All development starts with a story in `docs/stories/`
2. **Update progress** - Mark checkboxes as tasks complete: [ ] → [x]
3. **Track changes** - Maintain the File List section in the story
4. **Follow criteria** - Implement exactly what the acceptance criteria specify

### Code Standards
- Write clean, self-documenting code
- Follow existing patterns in the codebase
- Include comprehensive error handling
- Add unit tests for all new functionality
- Use TypeScript/JavaScript best practices

### Testing Requirements
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features
- Test edge cases and error scenarios

## AIOS Framework Structure

```
.aios-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```

## Workflow Execution

### Task Execution Pattern
1. Read the complete task/workflow definition
2. Understand all elicitation points
3. Execute steps sequentially
4. Handle errors gracefully
5. Provide clear feedback

### Interactive Workflows
- Workflows with `elicit: true` require user input
- Present options clearly
- Validate user responses
- Provide helpful defaults

## Best Practices

### When implementing features:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and testable
- Document complex logic

### When working with agents:
- Respect agent boundaries
- Use appropriate agent for each task
- Follow agent communication patterns
- Maintain agent context

### When handling errors:
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  // Provide helpful error message
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

## Git & GitHub Integration

### Commit Conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Reference story ID: `feat: implement IDE detection [Story 2.1]`
- Keep commits atomic and focused

### GitHub CLI Usage
- Ensure authenticated: `gh auth status`
- Use for PR creation: `gh pr create`
- Check org access: `gh api user/memberships`

## AIOS-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```

## Environment Setup

### Required Tools
- Node.js 18+
- GitHub CLI
- Git
- Your preferred package manager (npm/yarn/pnpm)

### Configuration Files
- `.aios/config.yaml` - Framework configuration
- `.env` - Environment variables
- `aios.config.js` - Project-specific settings

## Common Commands

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands
- `npm run dev` - Start development
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run build` - Build project

## Debugging

### Enable Debug Mode
```bash
export AIOS_DEBUG=true
```

### View Agent Logs
```bash
tail -f .aios/logs/agent.log
```

### Trace Workflow Execution
```bash
npm run trace -- workflow-name
```

## Claude Code Specific Configuration

### Performance Optimization
- Prefer batched tool calls when possible for better performance
- Use parallel execution for independent operations
- Cache frequently accessed data in memory during sessions

### Tool Usage Guidelines
- Always use the Grep tool for searching, never `grep` or `rg` in bash
- Use the Task tool for complex multi-step operations
- Batch file reads/writes when processing multiple files
- Prefer editing existing files over creating new ones

### Session Management
- Track story progress throughout the session
- Update checkboxes immediately after completing tasks
- Maintain context of the current story being worked on
- Save important state before long-running operations

### Error Recovery
- Always provide recovery suggestions for failures
- Include error context in messages to user
- Suggest rollback procedures when appropriate
- Document any manual fixes required

### Testing Strategy
- Run tests incrementally during development
- Always verify lint and typecheck before marking complete
- Test edge cases for each new feature
- Document test scenarios in story files

### Documentation
- Update relevant docs when changing functionality
- Include code examples in documentation
- Keep README synchronized with actual behavior
- Document breaking changes prominently

---

# Eisenhower AI Matrix Project Specifics

## Project Overview

**Eisenhower AI Matrix** is a task prioritization web application that uses Google Gemini AI to automatically categorize tasks into the Eisenhower Matrix (Urgent/Important quadrants) and integrates with WhatsApp via UAZAPI for task sharing.

### Key Technologies
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **Google Generative AI (Gemini 3 Flash)** - Task categorization engine
- **Font Awesome** - Icons (via CDN)

### Application Architecture
This is a client-side React SPA with:
- Single page served from `index.html`
- All styling via Tailwind CSS utilities
- All icons via Font Awesome
- Local storage persistence for tasks and configuration
- Direct API calls to Google Gemini and UAZAPI (no backend)

## Project Setup & Development

### Development Setup

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and add:
# - VITE_GEMINI_API_KEY: Your Google Generative AI API key from https://ai.google.dev/

# Start dev server
npm run dev
# Server runs on http://localhost:3000
```

### Common Commands

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Production build (outputs to dist/)
npm run preview  # Preview production build locally
```

## Project Structure

```
.
├── App.tsx                      # Main application component
├── index.tsx                    # React entry point
├── types.ts                     # TypeScript type definitions
├── geminiService.ts             # Google Gemini API integration
├── components/
│   ├── ActivityInput.tsx        # Task input form component
│   └── EisenhowerMatrix.tsx     # 2x2 matrix display component
├── index.html                   # HTML template with CDN imports
├── index.css                    # Global styles
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Core Architecture

### State Management
The application uses React hooks for state management in `App.tsx`:
- `tasks`: Array of Task objects organized by quadrant
- `config`: UAZAPI integration settings (token, phone number)
- `loading`: AI categorization in progress
- `sending`: WhatsApp send in progress
- `connectionStatus`: WhatsApp connection status tracking

All state persists to browser localStorage for data retention across sessions.

### Task Categorization Flow
1. User enters task description in `ActivityInput` component
2. `handleAddTask` calls `categorizeTask()` from `geminiService.ts`
3. Google Gemini API returns quadrant category (DO, SCHEDULE, DELEGATE, ELIMINATE)
4. Task is added to state with category and timestamp
5. `EisenhowerMatrix` re-renders to display task in appropriate quadrant

### WhatsApp Integration
- Tasks formatted as markdown-style list via `formatMatrixForWhatsApp()`
- Sent to UAZAPI endpoint: `https://free.uazapi.com/send/text`
- Requires token (from UAZAPI account) and destination phone number
- Connection status tracked and displayed in header
- Error codes (401 = invalid token, 503 = WhatsApp disconnected) handled with helpful guidance

### Component Hierarchy
```
App
├── ActivityInput (task input form)
├── EisenhowerMatrix
│   └── QuadrantBox (×4)
│       └── Task items
├── Settings Modal (UAZAPI config)
└── Toast Notifications
```

## Key Implementation Details

### Types Definition (`types.ts`)
- `Quadrant` enum: DO, SCHEDULE, DELEGATE, ELIMINATE
- `Task` interface: id, text, quadrant, createdAt
- `EisenhowerState` interface: state shape

### Gemini Service (`geminiService.ts`)
- Uses `@google/genai` package with JSON schema response
- Model: `gemini-3-flash-preview`
- Prompts in Portuguese with detailed categorization criteria
- Falls back to `DO` quadrant if parsing fails
- Environment variable: `VITE_GEMINI_API_KEY`

### UI Patterns
- Sticky header with action buttons using Tailwind
- Toast notifications for user feedback (success/error/info)
- Settings modal with error-specific guidance (503 WhatsApp disconnection)
- Scrollable quadrant boxes with task count badges
- Responsive grid: 1 column mobile, 2 columns desktop

## Development Guidelines for This Project

### Adding Features
1. Check if new state or API calls are needed
2. Update types in `types.ts` first
3. Add component or modify existing ones
4. Persist new state to localStorage if needed
5. Follow AIOS story-driven development approach
6. Test in browser (no tests configured yet)

### Styling
- All styles use Tailwind CSS utility classes
- Color scheme: indigo (primary), red/blue/amber/slate (quadrants)
- Use existing patterns for consistency (buttons, inputs, modals)
- Icons via Font Awesome classes (fas/fab prefixes)

### Error Handling
- API errors caught in try/catch blocks
- User-facing errors shown in toast notifications or modals
- Specific guidance provided for UAZAPI error codes
- Console errors logged for debugging

### Environment Variables
The app uses one required environment variable:
- `VITE_GEMINI_API_KEY`: Google Generative AI API key (Vite prefixes with VITE_)
- Defined in `vite.config.ts` and used in `geminiService.ts` as `import.meta.env.VITE_GEMINI_API_KEY`

### Browser APIs Used
- `localStorage`: Task and config persistence
- `fetch()`: HTTP requests to Gemini and UAZAPI
- `window.confirm()`: Clear all tasks confirmation

## Performance Considerations

- Tailwind CSS loaded from CDN (not optimized for production)
- React and dependencies loaded from esm.sh CDN
- Each task categorization makes a Gemini API call (potential bottleneck for many tasks)
- All state in memory; no database backend
- No code splitting or lazy loading currently implemented

## Security Notes

- API keys stored in browser (frontend only - expected for this architecture)
- UAZAPI token stored in localStorage (user owns risk)
- No authentication system
- CORS likely permissive for UAZAPI integration
- User data not sent anywhere except Gemini and UAZAPI as per config

## Common Development Tasks

### Debug Task Categorization
Check the Gemini API response in `geminiService.ts` - add console.log before JSON.parse:
```typescript
console.log("Gemini response:", text);
const json = JSON.parse(text.trim());
```

### Change Quadrant Colors
Edit colors in `EisenhowerMatrix.tsx` QuadrantBox components:
- DO: `bg-red-50 border-red-200 text-red-700`
- SCHEDULE: `bg-blue-50 border-blue-200 text-blue-700`
- DELEGATE: `bg-amber-50 border-amber-200 text-amber-700`
- ELIMINATE: `bg-slate-100 border-slate-200 text-slate-500`

### Adjust Gemini Prompt
Modify the prompt string in `geminiService.ts` `categorizeTask()` function. The JSON schema must remain valid.

### Add New UI Sections
Import React at top of component file, follow existing patterns for state management and styling, export as named component.

---

*Synkra AIOS Claude Code Configuration v2.0 - Eisenhower AI Matrix Edition*

**Last Updated:** 2026-01-27
