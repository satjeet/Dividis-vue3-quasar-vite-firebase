#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Initializing Test Toolkit Environment...${NC}\n"

# List of all test tool scripts
SCRIPTS=(
    "test-toolkit.sh"
    "test-logger.sh"
    "validate-test-setup.sh"
    "fix-test-setup.sh"
    "analyze-logs.sh"
    "visualize-reports.sh"
    "setup-test-env.sh"
    "test-manager.sh"
)

# Required directories
DIRECTORIES=(
    "src/tests"
    "src/tests/config"
    "src/tests/examples"
    "src/tests/utils"
    "src/tests/types"
    "src/tests/components"
    "src/tests/composables"
    "test-reports"
    "test-logs"
    "test-setup-backups"
)

# Make scripts executable
echo -e "${BLUE}Making scripts executable...${NC}"
for script in "${SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ]; then
        chmod +x "scripts/$script"
        echo -e "${GREEN}✓ Made $script executable${NC}"
    else
        echo -e "${RED}✗ Script $script not found${NC}"
    fi
done

# Create required directories
echo -e "\n${BLUE}Creating required directories...${NC}"
for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GREEN}✓ Created directory $dir${NC}"
    else
        echo -e "${YELLOW}! Directory $dir already exists${NC}"
    fi
done

# Setup config file
if [ ! -f ".test-toolkit-config" ]; then
    echo -e "\n${BLUE}Creating default configuration...${NC}"
    echo "# Test Toolkit Configuration
REPORT_DIR=test-reports
LOG_DIR=test-logs
BACKUP_DIR=test-setup-backups
CHART_WIDTH=50
CHART_HEIGHT=15
MAX_LOG_FILES=5
LOG_RETENTION_DAYS=30
VERBOSE=false" > .test-toolkit-config
    echo -e "${GREEN}✓ Created default configuration${NC}"
else
    echo -e "\n${YELLOW}! Configuration file already exists${NC}"
fi

# Add npm scripts
echo -e "\n${BLUE}Adding npm scripts...${NC}"
SCRIPTS_TO_ADD=(
    "test:toolkit:./scripts/test-toolkit.sh"
    "test:init:./scripts/setup-test-env.sh"
    "test:fix:./scripts/fix-test-setup.sh"
    "test:validate:./scripts/validate-test-setup.sh"
    "test:analyze:./scripts/analyze-logs.sh"
    "test:visualize:./scripts/visualize-reports.sh"
)

for script_entry in "${SCRIPTS_TO_ADD[@]}"; do
    script_name="${script_entry%%:*}"
    script_command="${script_entry#*:}"

    if ! grep -q "\"$script_name\":" package.json; then
        # Use temporary files to handle JSON properly
        jq ".scripts[\"$script_name\"] = \"$script_command\"" package.json > tmp.$$ && mv tmp.$$ package.json
        echo -e "${GREEN}✓ Added npm script: $script_name${NC}"
    else
        echo -e "${YELLOW}! npm script $script_name already exists${NC}"
    fi
done

# Verify installation
echo -e "\n${BLUE}Verifying installation...${NC}"

# Check executable permissions
all_executable=true
for script in "${SCRIPTS[@]}"; do
    if [ -f "scripts/$script" ] && [ ! -x "scripts/$script" ]; then
        all_executable=false
        echo -e "${RED}✗ $script is not executable${NC}"
    fi
done

# Check directories
all_dirs_exist=true
for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        all_dirs_exist=false
        echo -e "${RED}✗ Directory $dir is missing${NC}"
    fi
done

# Check configuration
if [ ! -f ".test-toolkit-config" ]; then
    echo -e "${RED}✗ Configuration file is missing${NC}"
    config_exists=false
else
    config_exists=true
fi

# Final status
echo -e "\n${BLUE}Installation Status:${NC}"
if [ "$all_executable" = true ] && [ "$all_dirs_exist" = true ] && [ "$config_exists" = true ]; then
    echo -e "${GREEN}✓ Test Toolkit installed successfully${NC}"
    echo -e "\nYou can now use the following commands:"
    echo -e "  ${YELLOW}npm run test:toolkit${NC}     - Launch the test toolkit"
    echo -e "  ${YELLOW}npm run test:init${NC}        - Initialize test environment"
    echo -e "  ${YELLOW}npm run test:validate${NC}    - Validate setup"
    echo -e "  ${YELLOW}npm run test:fix${NC}         - Fix common issues"
    echo -e "  ${YELLOW}npm run test:analyze${NC}     - Analyze test results"
    echo -e "  ${YELLOW}npm run test:visualize${NC}   - Visualize test data"
else
    echo -e "${RED}✗ Some components failed to install${NC}"
    echo -e "${YELLOW}Please check the errors above and try again${NC}"
fi

# Make this script executable
chmod +x scripts/init-test-tools.sh
