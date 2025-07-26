# Linear CLI - AI Agent Documentation

## Project Overview

TypeScript CLI for Linear API. Organization: Medtrics. Repository: github.com/medtrics/linear.

## Architecture

### Directory Structure

```
src/
├── cli.ts              # Entry point, command registration
├── commands/           # Command implementations
│   ├── list-issues.ts  # Lists project issues in table format
│   ├── create-issue.ts # Creates new issues
│   ├── update-issue.ts # Updates existing issues
│   ├── move-issue.ts   # Moves issues between states
│   ├── archive-issue.ts# Soft deletes (recoverable)
│   └── delete-issue.ts # Hard deletes (permanent)
└── lib/                # Core utilities
    ├── index.ts        # Barrel exports
    ├── config.ts       # Environment configuration
    ├── linear.ts       # Linear API client wrapper
    ├── errors.ts       # Error handling utilities
    ├── output.ts       # Logging helpers
    ├── prompts.ts      # User interaction utilities
    └── utils.ts        # Shared utilities
```

## Technology Stack

- **Runtime**: Node.js with tsx
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (REQUIRED)
- **CLI Framework**: Commander.js
- **Linear SDK**: @linear/sdk
- **Table Output**: cli-table3
- **Code Quality**: Biome (linting/formatting)
- **Git Hooks**: Husky + lint-staged
- **Commit Linting**: commitlint (conventional commits)

## Commands

### list-issues

- Shows issues in table: ID, Title, State, Labels, Assignee
- Filters by current project (from env)
- Parallel data fetching for performance

### create-issue

- Required: `--title`
- Optional: `--description`, `--state`, `--labels` (comma-separated), `--assignee` (email)
- Validates all inputs against team data

### update-issue <issueId>

- Requires at least one update option
- Special: `--assignee none` to unassign
- Labels replace existing (not append)

### move-issue <issueId> <state>

- Moves issue to specified workflow state
- Shows current state before moving
- Validates target state exists
- Detects if already in target state
- State names are case-insensitive

### archive-issue <issueId>

- Soft delete with confirmation
- `--force` skips confirmation
- Can be restored via Linear UI

### delete-issue <issueId>

- PERMANENT deletion
- Double confirmation required
- `--force` skips confirmation
- Shows warnings about irreversibility

## Code Patterns

### Error Handling

```typescript
try {
  // operation
} catch (error) {
  handleError(error); // Centralized handler
}
```

### Async Operations

- Use Promise.all for parallel operations
- Helper methods return typed promises
- No blocking sequential operations

### Logging

- `log()` - Raw output
- `logInfo()` - Information with newline
- `logSuccess()` - Success with checkmark
- `logWarning()` - Warning with symbol
- `logError()` - Error with X
- `logDanger()` - Critical warning
- `logNote()` - Note prefix
- `logUrl()` - URL formatting
- `logDetail()` - Indented details
- NO direct console.log usage

### Type Safety

- Strict TypeScript configuration
- Use SDK types, avoid `any`
- Helper functions are strongly typed

## Development Workflow

### Setup

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with credentials
```

### Commands

- `pnpm linear <command>` - Run CLI
- `pnpm check` - Lint + typecheck
- `pnpm format` - Format code
- `pnpm prepare` - Setup git hooks

### Git Workflow

1. Make changes
2. `pnpm check` runs automatically on commit
3. Commit with conventional format
4. Push to main branch

## Commit Conventions

Format: `type(scope): description`

Types:

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `docs:` Documentation
- `test:` Tests
- `chore:` Maintenance

Examples:

- `feat: add create-issue command`
- `fix: handle missing assignee error`
- `refactor: extract label parsing logic`

## Configuration Files

### tsconfig.json

- Target: ESNext
- Module: ESNext
- Strict: true
- No emit (tsx handles compilation)

### biome.json

- 2-space indentation
- Double quotes
- No unused imports/variables
- Import organization enabled

### .env.local

```env
LINEAR_API_KEY=lin_api_xxxx
LINEAR_TEAM_NAME=Team Name
LINEAR_PROJECT_NAME=Project Name
```

## Key Implementation Details

### Environment Loading

- Uses dotenv with .env.local
- Required vars validated on startup
- Clear error messages for missing config

### Linear API Client

- Singleton instance
- Methods wrap SDK calls with error handling
- Cache for team/project lookups
- Helper methods for common operations

### Command Structure

- Each command is separate file
- Imports from "../lib" barrel
- Consistent error handling pattern
- Validation before API calls

### DRY Principles

- `askConfirmation()` in prompts.ts
- `parseLabelIds()` in utils.ts
- `showIssueDetails()` for consistent display
- Logging helpers prevent console.log repetition

## Testing Approach

Manual testing via CLI. No automated tests yet.
Verify with `pnpm check` before committing.

## Future Considerations

- Add automated tests
- Implement issue filtering options
- Add batch operations
- Consider adding issue templates

## Important Notes

- Always use pnpm, not npm or yarn
- Run `pnpm check` before committing
- Follow existing patterns for new commands
- Keep commands focused and simple
- Maintain consistency in error messages
- Use semantic logging helpers
