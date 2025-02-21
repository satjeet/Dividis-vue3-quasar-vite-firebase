#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Fixing test environment setup...${NC}\n"

# Create necessary directories
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p src/tests/{config,examples,utils,types,components,composables}

# Install missing dependencies
echo -e "\n${BLUE}Checking and installing dependencies...${NC}"
dependencies=(
  "@vue/test-utils@next"
  "@vue/compiler-dom"
  "vitest"
  "vitest-environment-jsdom"
  "@types/node"
  "jsdom"
  "@testing-library/vue"
  "@vitejs/plugin-vue"
  "happy-dom"
)

for dep in "${dependencies[@]}"; do
  if ! grep -q "\"${dep%@*}\"" package.json; then
    echo -e "Installing $dep..."
    npm install -D "$dep"
  fi
done

# Add npm scripts if missing
echo -e "\n${BLUE}Configuring npm scripts...${NC}"
if ! grep -q "\"test\":" package.json; then
  npm pkg set scripts.test="vitest"
fi

if ! grep -q "\"test:watch\":" package.json; then
  npm pkg set scripts.test:watch="vitest --watch"
fi

if ! grep -q "\"test:coverage\":" package.json; then
  npm pkg set scripts.test:coverage="vitest run --coverage"
fi

if ! grep -q "\"test:ui\":" package.json; then
  npm pkg set scripts.test:ui="vitest --ui"
fi

# Fix TypeScript configuration
echo -e "\n${BLUE}Updating TypeScript configuration...${NC}"
if [ ! -f "tsconfig.test.json" ] || ! grep -q "vitest/globals" tsconfig.test.json; then
  echo '{
  "extends": "./tsconfig.json",
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/tests/**/*.ts"
  ],
  "compilerOptions": {
    "types": ["vitest/globals", "node", "@vue/test-utils"],
    "baseUrl": ".",
    "paths": {
      "@test/*": ["src/tests/*"],
      "@/*": ["src/*"]
    }
  }
}' > tsconfig.test.json
fi

# Fix Vitest configuration
echo -e "\n${BLUE}Updating Vitest configuration...${NC}"
if [ ! -f "vitest.config.ts" ]; then
  echo 'import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.config.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "@": "/src",
      "@test": "/src/tests"
    }
  }
})' > vitest.config.ts
fi

# Create or update test setup file
echo -e "\n${BLUE}Creating test setup...${NC}"
if [ ! -f "src/tests/setup.ts" ]; then
  echo 'import { afterEach, vi } from "vitest"
import { config } from "@vue/test-utils"
import { setupTestHooks } from "./config/environment"

// Setup test hooks
setupTestHooks()

// Configure Vue Test Utils
config.global.stubs = {}
config.global.mocks = {}

// Reset handlers after each test
afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
})' > src/tests/setup.ts
fi

# Update .gitignore
echo -e "\n${BLUE}Updating .gitignore...${NC}"
if ! grep -q "coverage/" .gitignore; then
  echo '
# Test files
coverage/
.nyc_output/
test-results/
playwright-report/
' >> .gitignore
fi

# Run validation
echo -e "\n${BLUE}Validating fixes...${NC}"
if [ -f "scripts/validate-test-setup.sh" ]; then
  ./scripts/validate-test-setup.sh
else
  echo -e "${YELLOW}Validation script not found. Please run manual validation.${NC}"
fi

echo -e "\n${GREEN}Fix process completed!${NC}"
echo -e "You may need to restart your IDE/editor to pick up the changes."
echo -e "Try running ${BLUE}npm test${NC} to verify the setup."

# Make the script executable
chmod +x scripts/fix-test-setup.sh
