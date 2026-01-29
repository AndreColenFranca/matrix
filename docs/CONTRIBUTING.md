# Contributing Guidelines

Thank you for your interest in contributing to the Eisenhower AI Matrix project! This document outlines the process for contributing code, reporting bugs, and proposing features.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors are expected to:

- Be respectful and professional
- Provide constructive feedback
- Be open to different perspectives
- Report inappropriate behavior

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes**
5. **Submit a pull request**

## Development Setup

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Set up environment file
cp .env.example .env.local

# Start development
npm run dev
```

## Reporting Bugs

### Before Reporting

- Search existing issues for similar reports
- Check the documentation for known limitations
- Verify the issue with the latest code

### Creating a Bug Report

Include the following information:

1. **Title**: Concise description of the bug
2. **Environment**: OS, Node version, npm version
3. **Steps to Reproduce**: Clear step-by-step instructions
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Screenshots**: If applicable
7. **Logs**: Error messages and console output

**Example:**

```
Title: Task input loses focus after submission

Environment:
- OS: Windows 11
- Node: 20.5.0
- npm: 9.8.1

Steps to Reproduce:
1. Open the application
2. Enter a task in the input field
3. Click Submit or press Enter
4. Type another task immediately

Expected Behavior:
Input field should be focused and ready for the next task

Actual Behavior:
Focus is lost and I must click the input field again

Screenshots:
[Attached screenshot]
```

## Proposing Features

### Feature Request Format

Create an issue with the label `enhancement` including:

1. **Description**: Clear explanation of the feature
2. **Use Case**: Why this feature is needed
3. **Proposed Solution**: How it should work
4. **Alternatives**: Other possible approaches
5. **Additional Context**: Screenshots, mockups, or examples

**Example:**

```
Title: Add task due dates

Description:
Tasks should be able to have optional due dates to improve planning.

Use Case:
Users want to know which tasks should be completed by when, especially
for the "SCHEDULE" quadrant.

Proposed Solution:
- Add date picker to task creation form
- Display due dates in task list
- Show overdue indicator for past due dates
- Optional: Sort by due date

Additional Context:
[Mockup screenshot]
```

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with latest changes

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run quality checks** (all must pass)

   ```bash
   npm run quality-gate
   npm run test
   ```

3. **Follow the coding standards** in [CODING_STANDARDS.md](./CODING_STANDARDS.md)

4. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch** to your fork

   ```bash
   git push origin feature/your-feature
   ```

2. **Open a PR** on GitHub

3. **Fill out the PR template** with:
   - **Title**: Concise description starting with action verb
   - **Description**: Explain what changed and why
   - **Related Issues**: Link to issue #123
   - **Testing**: Describe how the change was tested
   - **Checklist**: Verify all items are complete

### PR Title Format

```
<type>: <description>

Examples:
feat: add task sorting by due date
fix: prevent duplicate task entries
docs: update API documentation
chore: upgrade dependencies
```

### PR Description Template

```markdown
## Description

Briefly describe what this PR accomplishes.

## Related Issue

Closes #123

## Type of Change

- [ ] New feature (non-breaking change that adds functionality)
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] Breaking change (feature or fix that would cause existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?

- Tested on Windows 11 / macOS / Ubuntu
- Manual testing steps:
  1. Do this
  2. Then do that
  3. Verify result

## Testing Checklist

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass: `npm run test`
- [ ] No console errors or warnings
- [ ] Responsive design tested

## Code Quality Checklist

- [ ] Follows coding standards: `npm run quality-gate`
- [ ] No console.log() statements (use proper logging)
- [ ] Error handling implemented
- [ ] No breaking changes
- [ ] Comments added for complex logic

## Documentation Checklist

- [ ] Updated relevant .md files
- [ ] Added JSDoc comments to new functions
- [ ] Updated CHANGELOG (if applicable)
- [ ] Screenshots added (if UI changes)

## Deployment Notes

Any special deployment considerations or database migrations needed?
```

## Review Process

### What to Expect

1. **Automated checks** run automatically:
   - ESLint, Prettier, TypeScript
   - Build verification
   - Tests

2. **Code review** by maintainers:
   - Check for code quality
   - Verify adherence to standards
   - Suggest improvements

3. **Changes requested** (if needed):
   - Address feedback
   - Push new commits
   - Re-request review

4. **Approval and merge**:
   - PR approved by maintainers
   - Merged to main branch
   - Deployed to production

### Review Guidelines for Contributors

When reviewing others' PRs:

1. **Be constructive**: Provide helpful suggestions
2. **Be specific**: Quote code and explain concerns
3. **Be kind**: Assume good intentions
4. **Be thorough**: Check functionality, performance, security

## Commit Guidelines

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing or updating tests
- `chore`: Changes to build process, dependencies, etc.

### Scope (Optional)

Component or area of change:

- `auth`, `tasks`, `ui`, `api`, `db`, etc.

### Subject

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

### Body (Optional)

- Wrap at 72 characters
- Explain what and why, not how
- Separate from subject with blank line

### Footer (Optional)

- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(auth): add password reset functionality

Add password reset email flow with token validation and expiry.
Users can now reset forgotten passwords via email link.

Closes #456
```

```
fix(tasks): prevent task duplication on rapid submission

Add debounce to submit button to prevent multiple API calls
when user clicks rapidly.

Fixes #789
```

```
docs: update API integration guide

Add examples for new Supabase real-time features.
```

## Testing Requirements

### Unit Tests

- Test public functions in isolation
- Mock external dependencies
- Cover happy path and error cases
- Minimum 80% code coverage

### Integration Tests

- Test component interactions
- Test with real data
- Test user workflows
- Cover critical paths

### Example Test

```typescript
describe('addTask', () => {
  it('should categorize task and add to database', async () => {
    // Arrange
    const mockText = 'Fix critical bug';
    const mockQuadrant = Quadrant.DO;
    jest.spyOn(geminiService, 'categorizeTask').mockResolvedValue(mockQuadrant);

    // Act
    await addTask(mockText);

    // Assert
    expect(geminiService.categorizeTask).toHaveBeenCalledWith(mockText);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].quadrant).toBe(mockQuadrant);
  });
});
```

### Running Tests

```bash
npm run test              # Run all tests
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report
npm run test -- TaskFoo  # Specific test file
npm run test -- -u       # Update snapshots
```

## Documentation

### Files to Update

- **README.md**: If changing user-facing features
- **docs/ARCHITECTURE.md**: If changing system design
- **docs/CODING_STANDARDS.md**: If adding new conventions
- **docs/DEVELOPMENT.md**: If adding new commands or workflows
- **Code Comments**: Add JSDoc for new functions

### Documentation Format

Use Markdown with:

```markdown
# Heading 1

## Heading 2

### Heading 3

**Bold text**
_Italic text_

- List item 1
- List item 2

1. Numbered item
2. Numbered item

[Link text](https://example.com)

`inline code`

\`\`\`typescript
code block
\`\`\`

| Column 1 | Column 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
```

## Release Process

### Versioning

Follow Semantic Versioning (semver):

- `MAJOR.MINOR.PATCH` (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

### Release Steps

1. **Update version** in package.json
2. **Update CHANGELOG.md**
3. **Create git tag**: `git tag v1.2.3`
4. **Push tag**: `git push origin v1.2.3`
5. **Create release** on GitHub
6. **Deploy** to production

## Community

### Getting Help

- **GitHub Issues**: Ask questions and report issues
- **Discussions**: General questions and ideas
- **Pull Requests**: Code reviews and feedback

### Staying Updated

- Watch repository for notifications
- Follow project milestones
- Subscribe to release announcements

## Legal

By contributing, you agree that:

1. You have the right to contribute the work
2. Your contribution is licensed under the project's license
3. You grant the project maintainers the right to use your contribution

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Added to GitHub contributors list

---

**Last Updated**: 2026-01-28
**Version**: 1.0

Thank you for contributing to Eisenhower AI Matrix!
