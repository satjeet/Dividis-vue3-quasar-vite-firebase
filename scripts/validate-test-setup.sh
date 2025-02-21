#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Validating test environment setup...${NC}\n"

# Check required files
required_files=(
  "src/tests/setup.ts"
  "src/tests/config/environment.ts"
  "src/tests/config/mocks.ts"
  "src/tests/config/storage.ts"
  "src/tests/config/types.ts"
  "src/tests/types/vue-test.d.ts"
  "src/tests/utils/errors.ts"
  "src/tests/utils/test-helpers.ts"
  "vitest.config.ts"
  "tsconfig.test.json"
)

missing_files=()
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    missing_files+=("$file")
  fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
  echo -e "${GREEN}✓ All required test configuration files present${NC}"
else
  echo -e "${RED}✗ Missing test configuration files:${NC}"
  for file in "${missing_files[@]}"; do
    echo -e "  - $file"
  done
fi

# Check dependencies in package.json
required_deps=(
  "@vue/test-utils"
  "vitest"
  "@vue/compiler-dom"
  "vitest-environment-jsdom"
  "@types/node"
  "jsdom"
)

missing_deps=()
for dep in "${required_deps[@]}"; do
  if ! grep -q "\"$dep\"" package.json; then
    missing_deps+=("$dep")
  fi
done

if [ ${#missing_deps[@]} -eq 0 ]; then
  echo -e "\n${GREEN}✓ All required dependencies installed${NC}"
else
  echo -e "\n${RED}✗ Missing dependencies:${NC}"
  for dep in "${missing_deps[@]}"; do
    echo -e "  - $dep"
  done
  echo -e "\n${YELLOW}Run 'npm install' to install missing dependencies${NC}"
fi

# Check npm scripts
required_scripts=(
  "test"
  "test:watch"
  "test:coverage"
)

missing_scripts=()
for script in "${required_scripts[@]}"; do
  if ! grep -q "\"$script\":" package.json; then
    missing_scripts+=("$script")
  fi
done

if [ ${#missing_scripts[@]} -eq 0 ]; then
  echo -e "\n${GREEN}✓ All required npm scripts configured${NC}"
else
  echo -e "\n${RED}✗ Missing npm scripts:${NC}"
  for script in "${missing_scripts[@]}"; do
    echo -e "  - $script"
  done
fi

# Check TypeScript configuration
if grep -q "\"vitest/globals\"" tsconfig.test.json && \
   grep -q "\"@vue/test-utils\"" tsconfig.test.json; then
  echo -e "\n${GREEN}✓ TypeScript test configuration valid${NC}"
else
  echo -e "\n${RED}✗ TypeScript test configuration needs update${NC}"
  echo -e "  Check types configuration in tsconfig.test.json"
fi

# Try running a test to validate setup
echo -e "\n${BLUE}Running test validation...${NC}"
if npm test -- --run src/tests/examples/setup-usage.test.ts &> /dev/null; then
  echo -e "${GREEN}✓ Test environment working correctly${NC}"
else
  echo -e "${RED}✗ Test environment validation failed${NC}"
  echo -e "  Try running 'npm test' for detailed error messages"
fi

# Summary
echo -e "\n${BLUE}Test Environment Status:${NC}"
if [ ${#missing_files[@]} -eq 0 ] && [ ${#missing_deps[@]} -eq 0 ] && \
   [ ${#missing_scripts[@]} -eq 0 ]; then
  echo -e "${GREEN}✓ Environment fully configured${NC}"
else
  echo -e "${YELLOW}⚠ Environment needs attention${NC}"
  echo "Run './scripts/setup-test-env.sh' to fix configuration"
fi

# Make the script executable
chmod +x scripts/validate-test-setup.sh
