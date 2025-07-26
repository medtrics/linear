# Linear CLI - AI Agent Documentation

## Project Overview

TypeScript CLI for Linear API. Organization: Medtrics. Repository: github.com/medtrics/linear.

## Architecture

### Directory Structure

```
src/
├── cli.ts                # Entry point, command registration
├── commands/             # Command implementations
│   ├── list-issues.ts    # Lists project issues in table format
│   ├── create-issue.ts   # Creates new issues
│   ├── update-issue.ts   # Updates existing issues
│   ├── move-issue.ts     # Moves issues between states
│   ├── archive-issue.ts  # Soft deletes (recoverable)
│   └── delete-issue.ts   # Hard deletes (permanent)
└── lib/                  # Core utilities
    ├── index.ts          # Barrel exports
    ├── command-helpers.ts# Command-specific helpers
    ├── config.ts         # Environment configuration
    ├── linear.ts         # Linear API client wrapper + label parsing
    ├── errors.ts         # Error handling utilities + error codes
    ├── output.ts         # Logging helpers
    └── prompts.ts        # User interaction utilities
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
// Use withErrorHandling wrapper for commands
.action(
  withErrorHandling(async (options) => {
    // command logic
  })
)

// Error codes are centralized
ERROR_CODES.ISSUE_NOT_FOUND
ERROR_CODES.USER_NOT_FOUND
ERROR_CODES.STATE_NOT_FOUND
// etc.
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
- Use SDK types (Issue, User, WorkflowState, etc.)
- No `any` types - use `unknown` instead
- All async functions have explicit return types
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

### File Responsibilities

- **cli.ts**: Entry point, registers all commands
- **command-helpers.ts**: Reusable parsing functions (assignee, state, labels)
- **config.ts**: Environment variable loading and validation
- **linear.ts**: Linear SDK wrapper with caching and helper methods
- **errors.ts**: Custom error class and centralized error codes
- **output.ts**: Consistent logging functions with visual prefixes
- **prompts.ts**: User interaction (confirmations, issue details)

### Environment Loading

- Uses dotenv with .env.local
- Required vars validated on startup with `assertConfig()`
- Clear error messages for missing config
- No dotenv output logs (clean CLI output)

### Linear API Client (linear.ts)

- Singleton LinearClient instance
- Methods wrap SDK calls with error handling
- Simple cache for team/project lookups (no TTL)
- Helper methods:
  - `getTeamByName()` / `getCurrentTeam()`
  - `getProjectByName()` / `getCurrentProject()`
  - `getIssue()` / `getIssueOrThrow()`
  - `findUserByEmail()`, `findLabelByName()`, `findStateByName()`
  - `createIssue()`, `updateIssue()`, `archiveIssue()`, `deleteIssue()`
  - `parseLabelIds()` - converts label names to IDs
- All methods throw LinearCLIError with specific error codes

### Command Structure

- Each command is separate file
- Imports from "../lib" barrel
- Uses `withErrorHandling()` wrapper
- Uses `parseIssueOptions()` for common parameters
- Validation before API calls
- Consistent use of `ERROR_CODES`

### DRY Principles

- `askConfirmation()` in prompts.ts - reusable confirmation prompts
- `parseLabelIds()` in linear.ts - label name to ID conversion
- `showIssueDetails()` in prompts.ts - consistent issue display format
- `parseAssignee()` in command-helpers.ts - handles email and "none" cases
- `parseState()` in command-helpers.ts - validates workflow states
- `parseIssueOptions()` in command-helpers.ts - parallel processing of options
- `withErrorHandling()` wrapper - eliminates try/catch boilerplate
- `getIssueOrThrow()` in linear.ts - safe issue fetching with proper error

## Error Codes Reference

```typescript
ERROR_CODES = {
  CONFIG_MISSING: "CONFIG_MISSING", // Missing env vars
  TEAM_NOT_FOUND: "TEAM_NOT_FOUND", // Team doesn't exist
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND", // Project doesn't exist
  ISSUE_NOT_FOUND: "ISSUE_NOT_FOUND", // Issue ID invalid
  USER_NOT_FOUND: "USER_NOT_FOUND", // Assignee email invalid
  STATE_NOT_FOUND: "STATE_NOT_FOUND", // Workflow state invalid
  LABEL_NOT_FOUND: "LABEL_NOT_FOUND", // Label name invalid
  NO_UPDATES: "NO_UPDATES", // Update command with no options
  INVALID_INPUT: "INVALID_INPUT", // General validation error
  API_ERROR: "API_ERROR", // Linear API failure
};
```

## Performance Considerations

- **Parallel Operations**: Use `Promise.all()` for multiple API calls
- **Caching**: Team and project are cached after first lookup
- **No Sequential Blocking**: All data fetching happens in parallel

## Testing Approach

Manual testing via CLI. No automated tests yet.
Verify with `pnpm check` before committing.

## Adding New Commands

1. Create new file in `src/commands/`
2. Import from `"../lib"` barrel export
3. Use `withErrorHandling()` wrapper
4. Follow existing command structure:
   ```typescript
   export const myCommand = new Command("my-command")
     .description("Command description")
     .action(
       withErrorHandling(async (options) => {
         // Implementation
       }),
     );
   ```
5. Register in `cli.ts`
6. Update documentation

## Future Considerations

- Add automated tests
- Implement issue filtering options
- Add batch operations
- Consider adding issue templates
- Add support for multiple projects
- Add interactive mode for complex operations

## Important Notes

- Always use pnpm, not npm or yarn
- Run `pnpm check` before committing
- Follow existing patterns for new commands
- Keep commands focused and simple
- Maintain consistency in error messages
- Use semantic logging helpers
- Use `withErrorHandling()` for all command actions
- Use `ERROR_CODES` constants for all errors
- Import types from @linear/sdk, not custom interfaces
