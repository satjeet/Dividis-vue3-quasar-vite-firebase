#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="test-setup-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Show menu function
show_menu() {
  echo -e "\n${BLUE}Test Environment Manager${NC}"
  echo "1. Setup test environment"
  echo "2. Validate setup"
  echo "3. Fix issues"
  echo "4. Backup configuration"
  echo "5. Restore backup"
  echo "6. Clean test files"
  echo "7. Run tests"
  echo "8. Generate coverage report"
  echo "9. Update dependencies"
  echo "0. Exit"
  echo -e "\nChoose an option:"
}

# Backup function
backup_config() {
  echo -e "\n${BLUE}Creating backup...${NC}"
  mkdir -p "$BACKUP_DIR"
  BACKUP_NAME="test-setup-$TIMESTAMP"
  BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
  mkdir -p "$BACKUP_PATH"

  # Files to backup
  cp -r src/tests "$BACKUP_PATH/" 2>/dev/null || true
  cp tsconfig.test.json "$BACKUP_PATH/" 2>/dev/null || true
  cp vitest.config.ts "$BACKUP_PATH/" 2>/dev/null || true
  cp scripts/setup-test-env.sh "$BACKUP_PATH/" 2>/dev/null || true
  cp scripts/validate-test-setup.sh "$BACKUP_PATH/" 2>/dev/null || true
  cp scripts/fix-test-setup.sh "$BACKUP_PATH/" 2>/dev/null || true

  echo -e "${GREEN}Backup created at: $BACKUP_PATH${NC}"
}

# Restore function
restore_backup() {
  if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}No backups found${NC}"
    return 1
  fi

  echo -e "\n${BLUE}Available backups:${NC}"
  ls -1 "$BACKUP_DIR"

  echo -e "\nEnter backup name to restore (or press Enter to cancel):"
  read -r backup_name

  if [ -z "$backup_name" ]; then
    return 0
  fi

  if [ ! -d "$BACKUP_DIR/$backup_name" ]; then
    echo -e "${RED}Backup not found${NC}"
    return 1
  }

  echo -e "\n${YELLOW}Warning: This will overwrite current files. Continue? (y/N)${NC}"
  read -r confirm

  if [ "$confirm" != "y" ]; then
    echo "Restoration cancelled"
    return 0
  fi

  # Restore files
  cp -r "$BACKUP_DIR/$backup_name/"* .
  echo -e "${GREEN}Backup restored successfully${NC}"
}

# Clean function
clean_tests() {
  echo -e "\n${YELLOW}Warning: This will remove all test artifacts. Continue? (y/N)${NC}"
  read -r confirm

  if [ "$confirm" != "y" ]; then
    echo "Cleaning cancelled"
    return 0
  fi

  rm -rf coverage/
  rm -rf .nyc_output/
  rm -rf test-results/
  rm -rf playwright-report/
  find src/tests -name "*.test.ts" -type f -delete

  echo -e "${GREEN}Test artifacts cleaned${NC}"
}

# Update dependencies
update_deps() {
  echo -e "\n${BLUE}Updating test dependencies...${NC}"
  npm install -D @vue/test-utils@latest \
    @vue/compiler-dom@latest \
    vitest@latest \
    vitest-environment-jsdom@latest \
    @types/node@latest \
    jsdom@latest \
    @testing-library/vue@latest \
    @vitejs/plugin-vue@latest \
    happy-dom@latest

  echo -e "${GREEN}Dependencies updated${NC}"
}

# Main loop
while true; do
  show_menu
  read -r opt

  case $opt in
    1) # Setup
      if [ -f "scripts/setup-test-env.sh" ]; then
        ./scripts/setup-test-env.sh
      else
        echo -e "${RED}Setup script not found${NC}"
      fi
      ;;
    2) # Validate
      if [ -f "scripts/validate-test-setup.sh" ]; then
        ./scripts/validate-test-setup.sh
      else
        echo -e "${RED}Validation script not found${NC}"
      fi
      ;;
    3) # Fix
      if [ -f "scripts/fix-test-setup.sh" ]; then
        ./scripts/fix-test-setup.sh
      else
        echo -e "${RED}Fix script not found${NC}"
      fi
      ;;
    4) # Backup
      backup_config
      ;;
    5) # Restore
      restore_backup
      ;;
    6) # Clean
      clean_tests
      ;;
    7) # Run tests
      echo -e "\n${BLUE}Running tests...${NC}"
      npm test
      ;;
    8) # Coverage
      echo -e "\n${BLUE}Generating coverage report...${NC}"
      npm run test:coverage
      ;;
    9) # Update deps
      update_deps
      ;;
    0) # Exit
      echo -e "\n${GREEN}Goodbye!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option${NC}"
      ;;
  esac

  echo -e "\nPress Enter to continue"
  read -r
done

# Make the script executable
chmod +x scripts/test-manager.sh
