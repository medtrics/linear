# Linear CLI

A command-line interface for Linear project management, built with TypeScript.

## Installation

```bash
# Clone the repository
git clone https://github.com/medtrics/linear.git
cd linear

# Install dependencies (requires pnpm)
pnpm install
```

## Configuration

Create a `.env.local` file with your Linear credentials:

```env
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_NAME=Your Team Name
LINEAR_PROJECT_NAME=Your Project Name
```

Get your API key from: https://linear.app/settings/api

## Usage

### List Issues

```bash
pnpm linear list-issues
```

### Create Issue

```bash
pnpm linear create-issue --title "Bug fix" --description "Fix login error" --state "Backlog" --labels "Bug,Backend" --assignee "user@example.com"
```

### Update Issue

```bash
pnpm linear update-issue M2-123 --title "Updated title" --state "In Progress" --assignee "none"
```

### Move Issue

```bash
pnpm linear move-issue M2-123 "In Progress"
pnpm linear move-issue M2-123 "Done"
```

### Archive Issue

```bash
pnpm linear archive-issue M2-123
```

### Delete Issue (Permanent)

```bash
pnpm linear delete-issue M2-123
```

All commands support `--help` for more options.

## Development

```bash
# Run type checking and linting
pnpm check

# Format code
pnpm format
```

## License

MIT © Medtrics
