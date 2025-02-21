#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║         Run Your First Test            ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "\n${BLUE}Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    echo -e "${GREEN}✓ Node.js installed${NC}"
    node_version=$(node -v)
    echo "  Version: $node_version"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js${NC}"
    exit 1
fi

# Check npm
if command_exists npm; then
    echo -e "${GREEN}✓ npm installed${NC}"
    npm_version=$(npm -v)
    echo "  Version: $npm_version"
else
    echo -e "${RED}✗ npm not found. Please install npm${NC}"
    exit 1
fi

# Create example test if it doesn't exist
EXAMPLE_TEST="src/tests/examples/FirstTest.test.ts"
if [ ! -f "$EXAMPLE_TEST" ]; then
    echo -e "\n${BLUE}Creating example test...${NC}"
    mkdir -p src/tests/examples
    cat > "$EXAMPLE_TEST" << 'EOL'
import { describe, it, expect } from 'vitest'

describe('First Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success')
    expect(result).toBe('success')
  })

  it('should handle numbers', () => {
    expect(1 + 1).toBe(2)
  })
})
EOL
    echo -e "${GREEN}✓ Created example test: $EXAMPLE_TEST${NC}"
fi

# Initialize test environment if needed
if [ ! -f ".test-toolkit-config" ]; then
    echo -e "\n${BLUE}Initializing test environment...${NC}"
    ./scripts/init-test-tools.sh
fi

# Run the example test
echo -e "\n${BLUE}Running your first test...${NC}"
echo -e "${YELLOW}Test file: $EXAMPLE_TEST${NC}"
echo ""

npm test "$EXAMPLE_TEST"

# Check test result
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Congratulations! Your first test passed! 🎉${NC}"

    # Show next steps
    echo -e "\n${BLUE}Next Steps:${NC}"
    echo "1. Check the test file: $EXAMPLE_TEST"
    echo "2. Try modifying the test"
    echo "3. Run more tests with: npm run test:toolkit"
    echo "4. Read the quick start guide: src/tests/QUICK-START.md"
else
    echo -e "\n${RED}Test failed. Let's help you fix it!${NC}"
    echo -e "\n${BLUE}Troubleshooting Steps:${NC}"
    echo "1. Check the error message above"
    echo "2. Verify Node.js version: node -v"
    echo "3. Check dependencies: npm install"
    echo "4. Run setup validation: ./scripts/validate-test-setup.sh"
    echo "5. Read troubleshooting guide: src/tests/TROUBLESHOOTING.md"
fi

# Show available commands
echo -e "\n${BLUE}Useful Commands:${NC}"
echo "• Run all tests: npm run test:toolkit"
echo "• Run specific test: npm test <test-file>"
echo "• Watch mode: npm run test:toolkit -- --watch"
echo "• Test coverage: npm run test:toolkit -- --coverage"

# Open interactive menu option
echo -e "\n${YELLOW}Would you like to open the interactive test menu? [y/N]${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    ./scripts/test-toolkit.sh
else
    echo -e "\n${GREEN}Happy testing! 🚀${NC}"
fi

# Make script executable
chmod +x scripts/run-first-test.sh
