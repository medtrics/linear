# Linear CLI

A command-line interface for Linear project management, built with TypeScript.

## Features

- 📋 List issues from your Linear project
- ✨ Create new issues with labels, assignees, and states
- ✏️ Update existing issues
- 🚀 Move issues between workflow states
- 🗄️ Archive issues (recoverable)
- 🗑️ Delete issues permanently
- ⚡ Fast and type-safe with TypeScript
- 🎨 Beautiful table output

## Installation

```bash
# Clone the repository
git clone https://github.com/medtrics/linear.git
cd linear

# Install dependencies (requires pnpm)
pnpm install
```

## Prerequisites

- Node.js 20+
- pnpm (install with `npm install -g pnpm`)
- Linear account with API access

## Configuration

1. Get your Linear API key from: https://linear.app/settings/api

2. Create a `.env.local` file in the project root:

```env
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_NAME=Your Team Name
LINEAR_PROJECT_NAME=Your Project Name
```

**Note**: Team and project names must match exactly as shown in Linear.

## Usage

### List Issues

Display all issues from your configured project:

```bash
pnpm linear list-issues
```

### Create Issue

Create a new issue with various options:

```bash
# Basic issue
pnpm linear create-issue --title "Fix login bug"

# Full example with all options
pnpm linear create-issue \
  --title "Implement user authentication" \
  --description "Add OAuth2 login support" \
  --state "In Progress" \
  --labels "Feature,Backend" \
  --assignee "dev@company.com"
```

### Update Issue

Modify an existing issue:

```bash
# Update title and state
pnpm linear update-issue M2-123 --title "Updated title" --state "In Review"

# Unassign an issue
pnpm linear update-issue M2-123 --assignee none

# Replace all labels
pnpm linear update-issue M2-123 --labels "Bug,Critical"
```

### Move Issue

Quickly change an issue's workflow state:

```bash
pnpm linear move-issue M2-123 "In Progress"
pnpm linear move-issue M2-123 "Done"
```

### Archive Issue

Soft delete an issue (can be restored in Linear):

```bash
# With confirmation prompt
pnpm linear archive-issue M2-123

# Skip confirmation
pnpm linear archive-issue M2-123 --force
```

### Delete Issue

⚠️ **Permanently** delete an issue (cannot be undone):

```bash
# With double confirmation
pnpm linear delete-issue M2-123

# Skip confirmation (use with caution!)
pnpm linear delete-issue M2-123 --force
```

### Help

Get detailed help for any command:

```bash
pnpm linear --help
pnpm linear create-issue --help
```

## Command Options Reference

| Option          | Commands             | Description                                     |
| --------------- | -------------------- | ----------------------------------------------- |
| `--title`       | create, update       | Issue title                                     |
| `--description` | create, update       | Issue description                               |
| `--state`       | create, update, move | Workflow state (e.g., "Backlog", "In Progress") |
| `--labels`      | create, update       | Comma-separated labels (replaces all)           |
| `--assignee`    | create, update       | Email address or "none" to unassign             |
| `--force`       | archive, delete      | Skip confirmation prompts                       |

## Development

### Requirements

- TypeScript knowledge
- Familiarity with Linear's workflow

### Commands

```bash
# Run type checking and linting
pnpm check

# Format code
pnpm format
```

### Project Structure

```
src/
├── commands/      # Individual command implementations
├── lib/           # Shared utilities and helpers
└── cli.ts         # Main entry point
```

## Troubleshooting

### Common Issues

**"Team not found" error**

- Ensure `LINEAR_TEAM_NAME` matches exactly (case-sensitive)
- Check you have access to the team in Linear

**"Issue not found" error**

- Verify the issue ID format (e.g., M2-123)
- Ensure the issue exists and you have access

**"State not found" error**

- State names are case-insensitive but must match existing states
- Use `pnpm linear list-issues` to see available states

## Contributing

Contributions are welcome! Please:

1. Follow the existing code style
2. Run `pnpm check` before committing
3. Use conventional commit messages
4. Keep changes focused and simple

## License

MIT © Medtrics
