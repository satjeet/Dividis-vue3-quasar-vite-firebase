#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up test environment...${NC}"

# Install required dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install -D @vue/test-utils@next \
  @vue/compiler-dom \
  vitest-environment-jsdom \
  @types/node \
  jsdom \
  @testing-library/vue \
  @vitejs/plugin-vue \
  happy-dom

# Create test configuration
echo -e "${BLUE}Creating test configuration...${NC}"

# Create tsconfig.test.json
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

# Create vitest.config.ts
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

# Add scripts to package.json
echo -e "${BLUE}Adding npm scripts...${NC}"
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:watch="vitest --watch"
npm pkg set scripts.test:coverage="vitest run --coverage"
npm pkg set scripts.test:ui="vitest --ui"

# Create test setup file
echo -e "${BLUE}Creating test setup...${NC}"
mkdir -p src/tests

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

# Create test environment directory structure
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p src/tests/{config,examples,utils,types,components,composables}

# Update .gitignore
echo -e "${BLUE}Updating .gitignore...${NC}"
echo '
# Test files
coverage/
.nyc_output/
test-results/
playwright-report/
' >> .gitignore

echo -e "${GREEN}Test environment setup complete!${NC}"
echo -e "${BLUE}Run tests with: npm test${NC}"
echo -e "${BLUE}Watch mode: npm run test:watch${NC}"
echo -e "${BLUE}Coverage: npm run test:coverage${NC}"
echo -e "${BLUE}UI mode: npm run test:ui${NC}"

# Make the script executable
chmod +x scripts/setup-test-env.sh
