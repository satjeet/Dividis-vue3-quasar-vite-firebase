#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize counters
ERRORS=0
WARNINGS=0

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════╗"
echo "║        Pull Request Validation Tool        ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to add error
add_error() {
    echo -e "${RED}✗ Error: $1${NC}"
    ERRORS=$((ERRORS + 1))
}

# Function to add warning
add_warning() {
    echo -e "${YELLOW}⚠ Warning: $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

# Function to show success
show_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check dependencies
echo -e "\n${BLUE}Checking dependencies...${NC}"
REQUIRED_COMMANDS=("node" "npm" "git" "jq")
for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if command_exists "$cmd"; then
        show_success "$cmd is installed"
    else
        add_error "$cmd is not installed"
    fi
done

# Check if on feature branch
echo -e "\n${BLUE}Checking git branch...${NC}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" == "main" || "$BRANCH" == "develop" ]]; then
    add_error "You are on $BRANCH branch. Please work on a feature branch"
else
    show_success "Working on feature branch: $BRANCH"
fi

# Check for uncommitted changes
echo -e "\n${BLUE}Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
    add_warning "You have uncommitted changes"
else
    show_success "Working directory is clean"
fi

# Run tests
echo -e "\n${BLUE}Running tests...${NC}"
if npm test -- --silent; then
    show_success "All tests passed"
else
    add_error "Tests failed"
fi

# Check code formatting
echo -e "\n${BLUE}Checking code formatting...${NC}"
if command_exists "prettier"; then
    if npx prettier --check "src/**/*.{ts,vue}"; then
        show_success "Code formatting is correct"
    else
        add_warning "Code formatting issues found. Run 'prettier --write'"
    fi
else
    add_warning "Prettier not found. Skipping format check"
fi

# Validate test setup
echo -e "\n${BLUE}Validating test setup...${NC}"
if ./scripts/validate-test-setup.sh; then
    show_success "Test setup is valid"
else
    add_error "Test setup validation failed"
fi

# Check for documentation updates
echo -e "\n${BLUE}Checking documentation...${NC}"
DOCS_UPDATED=false
git diff --name-only | grep -q "\.md$" && DOCS_UPDATED=true
if [ "$DOCS_UPDATED" = false ]; then
    add_warning "No documentation changes found. Make sure docs are updated if needed"
else
    show_success "Documentation changes detected"
fi

# Check for test coverage
echo -e "\n${BLUE}Checking test coverage...${NC}"
if npm run test:coverage; then
    if [ -f "coverage/coverage-summary.json" ]; then
        COVERAGE=$(jq -r '.total.lines.pct' coverage/coverage-summary.json)
        if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
            show_success "Test coverage is $COVERAGE%"
        else
            add_warning "Test coverage is only $COVERAGE% (target: 80%)"
        fi
    else
        add_warning "Could not determine test coverage"
    fi
else
    add_error "Coverage report generation failed"
fi

# Check changelog
echo -e "\n${BLUE}Checking changelog...${NC}"
if git diff --name-only | grep -q "CHANGELOG.md"; then
    show_success "Changelog updated"
else
    add_warning "No changelog updates found"
fi

# Generate test report
echo -e "\n${BLUE}Generating test report...${NC}"
if ./scripts/analyze-logs.sh; then
    show_success "Test analysis completed"
else
    add_warning "Could not generate test analysis"
fi

# Summary
echo -e "\n${BLUE}Pull Request Validation Summary${NC}"
echo "----------------------------------------"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "\nYour PR is ready for submission."
else
    [ $ERRORS -gt 0 ] && echo -e "${RED}✗ Errors: $ERRORS${NC}"
    [ $WARNINGS -gt 0 ] && echo -e "${YELLOW}⚠ Warnings: $WARNINGS${NC}"
    echo -e "\nPlease fix the above issues before submitting your PR."
fi

# Checklist
echo -e "\n${BLUE}Pre-submission Checklist:${NC}"
echo "□ Tests are passing and coverage is adequate"
echo "□ Documentation is updated"
echo "□ Changelog is updated"
echo "□ Code follows style guidelines"
echo "□ All validation checks pass"
echo "□ PR description is clear and complete"
echo "□ Related issues are linked"

# Exit with error if there are errors
[ $ERRORS -gt 0 ] && exit 1
[ $WARNINGS -gt 0 ] && exit 0

# Make script executable
chmod +x scripts/check-pr.sh
