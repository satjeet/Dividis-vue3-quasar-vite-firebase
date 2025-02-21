#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required files and directories
REQUIRED_FILES=(
    "scripts/test-toolkit.sh"
    "scripts/init-test-tools.sh"
    "scripts/start-testing.sh"
    "scripts/check-pr.sh"
    "scripts/cleanup-test-tools.sh"
    "scripts/analyze-logs.sh"
    "scripts/visualize-reports.sh"
    "scripts/validate-test-setup.sh"
    "scripts/test-logger.sh"
    "src/tests/README.md"
    "src/tests/REFERENCE.md"
    "src/tests/TROUBLESHOOTING.md"
    "CHANGELOG.md"
    "CONTRIBUTING.md"
    ".github/PULL_REQUEST_TEMPLATE.md"
    ".github/workflows/test-toolkit-validation.yml"
    ".github/workflows/test-toolkit-maintenance.yml"
    ".github/workflows/test-toolkit-cleanup.yml"
    ".github/workflows/test-toolkit-release.yml"
)

REQUIRED_DIRS=(
    "scripts"
    "src/tests"
    "src/tests/config"
    "src/tests/examples"
    "src/tests/utils"
    "src/tests/components"
    ".github/workflows"
)

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║       Test Toolkit Verification        ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Initialize counters
ERRORS=0
WARNINGS=0
SUCCESS=0

# Function to check file
check_file() {
    local file="$1"
    if [ -f "$file" ]; then
        if [ -x "$file" ] || [[ "$file" != *.sh ]]; then
            echo -e "${GREEN}✓ $file exists${NC}"
            ((SUCCESS++))
        else
            echo -e "${YELLOW}⚠ $file exists but is not executable${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗ $file is missing${NC}"
        ((ERRORS++))
    fi
}

# Function to check directory
check_dir() {
    local dir="$1"
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ $dir exists${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗ $dir is missing${NC}"
        ((ERRORS++))
    fi
}

# Check workflow files
echo -e "\n${BLUE}Checking GitHub Workflows...${NC}"
for workflow in .github/workflows/test-toolkit-*.yml; do
    if [ -f "$workflow" ]; then
        # Validate YAML syntax
        if yamllint "$workflow" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ $workflow is valid${NC}"
            ((SUCCESS++))
        else
            echo -e "${RED}✗ $workflow has invalid YAML${NC}"
            ((ERRORS++))
        fi
    fi
done

# Check scripts and files
echo -e "\n${BLUE}Checking Required Files...${NC}"
for file in "${REQUIRED_FILES[@]}"; do
    check_file "$file"
done

# Check directories
echo -e "\n${BLUE}Checking Required Directories...${NC}"
for dir in "${REQUIRED_DIRS[@]}"; do
    check_dir "$dir"
done

# Check package.json scripts
echo -e "\n${BLUE}Checking npm Scripts...${NC}"
REQUIRED_SCRIPTS=(
    "test:toolkit"
    "test:init"
    "test:validate"
    "test:fix"
    "test:analyze"
    "test:visualize"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if grep -q "\"$script\":" package.json; then
        echo -e "${GREEN}✓ npm script $script exists${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗ npm script $script is missing${NC}"
        ((ERRORS++))
    fi
done

# Check documentation cross-references
echo -e "\n${BLUE}Checking Documentation Links...${NC}"
for md in src/tests/*.md; do
    if [ -f "$md" ]; then
        broken_links=$(grep -l "\[.*\].*(" "$md" | xargs -I{} sh -c 'for link in $(grep -o "\[.*\].*(" "{}" | grep -o "([^)]*)" | tr -d "()"); do [ ! -f "$link" ] && [ ! -f "$(dirname "{}")/$link" ] && [ ! -f "src/tests/$link" ] && echo "{}: $link"; done')
        if [ -n "$broken_links" ]; then
            echo -e "${YELLOW}⚠ $md has broken links:${NC}"
            echo "$broken_links"
            ((WARNINGS++))
        else
            echo -e "${GREEN}✓ $md links are valid${NC}"
            ((SUCCESS++))
        fi
    fi
done

# Check configuration files
echo -e "\n${BLUE}Checking Configuration...${NC}"
if [ -f ".test-toolkit-config" ]; then
    echo -e "${GREEN}✓ Test toolkit configuration exists${NC}"
    # Validate config format
    if grep -q "^[A-Z_]*=" .test-toolkit-config; then
        echo -e "${GREEN}✓ Configuration format is valid${NC}"
        ((SUCCESS++))
    else
        echo -e "${RED}✗ Invalid configuration format${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗ Test toolkit configuration is missing${NC}"
    ((ERRORS++))
fi

# Summary
echo -e "\n${BLUE}Verification Summary${NC}"
echo "----------------------------------------"
echo -e "${GREEN}Passed: $SUCCESS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Errors: $ERRORS${NC}"

# Optional checks suggestion
echo -e "\n${BLUE}Recommended Additional Checks:${NC}"
echo "1. Run full test suite: npm test"
echo "2. Validate test setup: ./scripts/validate-test-setup.sh"
echo "3. Check for updates: ./scripts/test-toolkit.sh (Option 6)"
echo "4. Review documentation: less src/tests/README.md"

# Exit with appropriate status
if [ $ERRORS -gt 0 ]; then
    echo -e "\n${RED}Verification failed with $ERRORS errors${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "\n${YELLOW}Verification passed with $WARNINGS warnings${NC}"
    exit 0
else
    echo -e "\n${GREEN}All verifications passed successfully${NC}"
    exit 0
fi

# Make script executable
chmod +x scripts/verify-toolkit.sh
