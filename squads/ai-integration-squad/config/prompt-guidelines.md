# AI Prompt Guidelines

## Eisenhower Matrix Categorization

### Prompt Structure

The prompt should:

1. Explain the Eisenhower Matrix
2. Define each quadrant clearly
3. Give 2-3 examples per quadrant
4. Ask for JSON response
5. Include decision criteria

### Quadrant Definitions

**DO (Urgent + Important)**

- Deadlines approaching
- Critical issues
- Fire-fighting

**SCHEDULE (Important + Not Urgent)**

- Strategic work
- Planning and preparation
- Skill development

**DELEGATE (Urgent + Not Important)**

- Others can do better
- Interruptions
- Administrative tasks

**ELIMINATE (Not Important + Not Urgent)**

- Time wasters
- Habits to drop
- Nice-to-haves

### JSON Response Format

```json
{
  "quadrant": "DO|SCHEDULE|DELEGATE|ELIMINATE",
  "reasoning": "Brief explanation",
  "confidence": 0.0 - 1.0
}
```

## Language & Tone

- Portuguese (Brazilian)
- Clear and concise
- Professional but friendly
- Explain reasoning

## Error Handling

- If task is ambiguous, ask for clarification
- If confidence < 0.7, suggest multiple options
- Provide fallback to "DO" if parsing fails
