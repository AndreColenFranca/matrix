# WhatsApp Integration Squad

UAZAPI WhatsApp integration, message formatting, and connection management.

## Purpose

This squad handles all WhatsApp-related functionality, including:

- UAZAPI integration and configuration
- Message formatting and delivery
- Connection status monitoring
- Error handling and recovery
- User token and phone number management

## Tech Stack

- **UAZAPI** - WhatsApp API service
- **TypeScript** - Type-safe API calls
- **Fetch API** - HTTP requests

## Components

### Agents

- **Integration Lead** - Manages UAZAPI setup and configuration
- **QA Specialist** - Tests message delivery and error scenarios

### Key Tasks

1. Setup UAZAPI client and authentication
2. Create message formatter for matrix tasks
3. Implement send message functionality
4. Handle connection status tracking
5. Implement error handling (401, 503, etc)
6. Test message delivery scenarios
7. Add retry logic and fallback

### Templates

- Message format template
- API request template
- Error handler template

### Checklists

- WhatsApp integration checklist
- Message delivery checklist

## Dependencies

**Depends on:**

- Frontend Squad (for settings UI)

**Depended on by:**

- (No other squads depend on this)

## Environment/Configuration

Users need to provide:

1. **UAZAPI Token** - Authentication token from UAZAPI account
2. **Destination Phone** - WhatsApp phone number to send to

These are stored in user settings/localStorage.

## API Endpoint

```
POST https://free.uazapi.com/send/text
```

## Quick Start

```bash
# View available tasks
ls tasks/

# Read a specific task
cat tasks/setup-uazapi.md

# Implement a task
# (assign to @dev agent)
```

## File Structure

```
whatsapp-integration-squad/
├── squad.yaml              # Manifest
├── README.md              # This file
├── config/
│   ├── coding-standards.md
│   ├── tech-stack.md
│   └── api-reference.md
├── agents/
│   ├── integration-lead.yaml
│   └── qa-specialist.yaml
├── tasks/
│   ├── setup-uazapi-client.md
│   ├── create-message-formatter.md
│   ├── implement-send-message.md
│   ├── connection-status.md
│   ├── error-handling.md
│   └── test-delivery.md
├── templates/
│   ├── message-format-template.ts
│   ├── api-request-template.ts
│   └── error-handler-template.ts
└── checklists/
    ├── whatsapp-integration-checklist.md
    └── message-delivery.md
```

## Message Format

Tasks should be formatted as a markdown-style list:

```
📋 EISENHOWER MATRIX

🔴 DO (Fazer Agora):
- Task 1
- Task 2

🔵 SCHEDULE (Agendar):
- Task 3
- Task 4

🟡 DELEGATE (Delegar):
- Task 5

⚫ ELIMINATE (Eliminar):
- Task 6
```

## Error Codes

| Code | Meaning               | Solution                                       |
| ---- | --------------------- | ---------------------------------------------- |
| 401  | Invalid token         | User must provide valid UAZAPI token           |
| 503  | WhatsApp disconnected | User must connect WhatsApp in UAZAPI dashboard |
| 400  | Bad request           | Check message format and phone number          |
| 429  | Rate limited          | Wait before sending next message               |

## Getting Started

1. Read `config/api-reference.md`
2. Review UAZAPI documentation
3. Pick a task from `tasks/` directory
4. Follow the task instructions
5. Test with real WhatsApp account before deploying
