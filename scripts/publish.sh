#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Parse arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${YELLOW}Dry run mode enabled${NC}"
fi

# Pre-flight checks
[[ "$(git branch --show-current)" != "main" ]] && { echo -e "${RED}Error: Must be on main branch${NC}"; exit 1; }
[[ -n "$(git status --porcelain)" ]] && { echo -e "${RED}Error: Uncommitted changes found${NC}"; exit 1; }

# Sync with remote
git pull origin main --quiet

# Version bump
CURRENT=$(node -p "require('./package.json').version")
echo -e "\nCurrent version: ${GREEN}$CURRENT${NC}"
echo "Select bump: [p]atch, [m]inor, [M]ajor"
read -n 1 -r CHOICE
echo

case $CHOICE in
    p) BUMP="patch";;
    m) BUMP="minor";;
    M) BUMP="major";;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1;;
esac

# Execute
if $DRY_RUN; then
    NEW_VERSION=$(npm version $BUMP --no-git-tag-version | sed 's/v//')
    git checkout -- package.json
    echo -e "\n${YELLOW}Would bump to: $NEW_VERSION${NC}"
    echo -e "${YELLOW}Would publish: @medtrics/linear@$NEW_VERSION${NC}"
else
    pnpm version $BUMP
    npm publish --access public
    echo -e "\n${GREEN}✓ Published successfully${NC}"
fi
