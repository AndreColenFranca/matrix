# Frontend Component Quality Checklist

## Code Quality

- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Prettier formatted
- [ ] Props interface defined
- [ ] No `any` types (unless justified)

## Functionality

- [ ] Component renders correctly
- [ ] All props working as expected
- [ ] Default props handled
- [ ] Error states handled

## Responsive Design

- [ ] Mobile (sm) layout correct
- [ ] Tablet (md) layout correct
- [ ] Desktop (lg) layout correct
- [ ] No layout shifts

## Accessibility

- [ ] Semantic HTML used
- [ ] ARIA labels present (if needed)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient (WCAG AA)

## Testing

- [ ] Unit tests written
- [ ] All tests passing
- [ ] Edge cases covered
- [ ] User interactions tested

## Documentation

- [ ] Component purpose clear
- [ ] Props documented
- [ ] Usage example provided
- [ ] Dependencies listed

## Performance

- [ ] No unnecessary re-renders
- [ ] Memo used if beneficial
- [ ] Dependencies optimized
- [ ] Bundle size reasonable
