# AI Integration Squad

Google Gemini AI categorization, prompt engineering, and task classification for Eisenhower Matrix.

## Purpose

This squad handles all AI-related functionality, including:

- Google Gemini API integration
- Task categorization and classification
- Prompt engineering and optimization
- Response validation and error handling
- Model optimization and performance tuning

## Tech Stack

- **Google Generative AI (Gemini 3 Flash)** - LLM model
- **TypeScript** - Type-safe API calls
- **JSON Schema** - Response validation

## Components

### Agents

- **AI Specialist** - Manages Gemini integration and prompting
- **Validation Expert** - Ensures categorization accuracy

### Key Tasks

1. Setup Gemini API client
2. Create categorization prompt
3. Implement response validation
4. Handle API errors and rate limits
5. Test categorization accuracy
6. Optimize prompt for Portuguese language
7. Implement fallback strategies

### Templates

- Gemini prompt template
- API response validation template
- Test case template for categorization

### Checklists

- AI integration checklist
- Prompt optimization checklist

## Dependencies

**Depends on:**

- Frontend Squad (UI to display results)

**Depended on by:**

- (No other squads depend on this)

## Environment Setup

```bash
# Required environment variable
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://ai.google.dev/

## Quick Start

```bash
# View available tasks
ls tasks/

# Read a specific task
cat tasks/setup-gemini-api.md

# Implement a task
# (assign to @dev agent)
```

## File Structure

```
ai-integration-squad/
├── squad.yaml              # Manifest
├── README.md              # This file
├── config/
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── prompt-guidelines.md
├── agents/
│   ├── ai-specialist.yaml
│   └── validation-expert.yaml
├── tasks/
│   ├── setup-gemini-api.md
│   ├── create-categorization-prompt.md
│   ├── implement-validation.md
│   ├── error-handling.md
│   ├── test-accuracy.md
│   ├── optimize-prompt.md
│   └── fallback-strategy.md
├── templates/
│   ├── prompt-template.md
│   ├── validation-template.ts
│   └── test-template.ts
└── checklists/
    ├── ai-integration-checklist.md
    └── prompt-optimization.md
```

## Categorization Quadrants

The AI categorizes tasks into 4 Eisenhower Matrix quadrants:

- **DO** (Urgent + Important) - Red
- **SCHEDULE** (Not Urgent + Important) - Blue
- **DELEGATE** (Urgent + Not Important) - Amber
- **ELIMINATE** (Not Urgent + Not Important) - Slate

## Prompt Engineering Notes

The prompt should:

1. Explain the Eisenhower Matrix clearly
2. Give examples for each quadrant
3. Ask for JSON response
4. Include clear decision criteria
5. Be in Portuguese (user language)

## Getting Started

1. Read `config/prompt-guidelines.md`
2. Review Gemini API docs
3. Pick a task from `tasks/` directory
4. Follow the task instructions
5. Test thoroughly before moving to production
