#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Show welcome banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║         Vue.js Test Toolkit Setup        ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# Check for required tools
check_requirements() {
    local missing_tools=()

    echo -e "${BLUE}Checking requirements...${NC}"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing_tools+=("Node.js")
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    fi

    # Check jq
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi

    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}Missing required tools:${NC}"
        printf '%s\n' "${missing_tools[@]}"
        echo -e "\n${YELLOW}Please install missing tools and try again${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ All requirements met${NC}"
}

# Quick start function
quick_start() {
    echo -e "\n${BLUE}Quick Start Setup${NC}"

    # Make scripts executable
    echo -e "\n${BLUE}Making scripts executable...${NC}"
    chmod +x scripts/*.sh
    echo -e "${GREEN}✓ Scripts are now executable${NC}"

    # Initialize test environment
    echo -e "\n${BLUE}Initializing test environment...${NC}"
    ./scripts/init-test-tools.sh

    # Run validation
    echo -e "\n${BLUE}Validating setup...${NC}"
    ./scripts/validate-test-setup.sh

    echo -e "\n${GREEN}Setup completed!${NC}"
    echo -e "\nAvailable commands:"
    echo -e "  ${YELLOW}npm run test:toolkit${NC}     - Launch test toolkit"
    echo -e "  ${YELLOW}npm run test:init${NC}        - Initialize environment"
    echo -e "  ${YELLOW}npm run test:validate${NC}    - Validate setup"
    echo -e "  ${YELLOW}npm run test:fix${NC}         - Fix common issues"
    echo -e "  ${YELLOW}npm run test:analyze${NC}     - Analyze test results"
    echo -e "  ${YELLOW}npm run test:visualize${NC}   - View test visualizations"
}

# Show options menu
show_menu() {
    echo -e "\n${BLUE}Select Setup Option:${NC}"
    echo "1. Quick Start (Recommended)"
    echo "2. Custom Setup"
    echo "3. Validate Only"
    echo "4. View Documentation"
    echo "0. Exit"
    echo -e "\nChoose an option:"
}

# Custom setup function
custom_setup() {
    echo -e "\n${BLUE}Custom Setup${NC}"

    # Ask for configuration
    echo -e "\n${BLUE}Configure Test Environment:${NC}"

    read -p "Test directory [src/tests]: " test_dir
    test_dir=${test_dir:-src/tests}

    read -p "Report directory [test-reports]: " report_dir
    report_dir=${report_dir:-test-reports}

    read -p "Log directory [test-logs]: " log_dir
    log_dir=${log_dir:-test-logs}

    read -p "Enable verbose logging? [y/N]: " verbose
    verbose=${verbose:-N}

    # Create custom configuration
    echo -e "\n${BLUE}Creating custom configuration...${NC}"
    echo "# Test Toolkit Configuration
TEST_DIR=$test_dir
REPORT_DIR=$report_dir
LOG_DIR=$log_dir
BACKUP_DIR=test-setup-backups
CHART_WIDTH=50
CHART_HEIGHT=15
MAX_LOG_FILES=5
LOG_RETENTION_DAYS=30
VERBOSE=${verbose,,}" > .test-toolkit-config

    # Initialize with custom config
    ./scripts/init-test-tools.sh

    echo -e "${GREEN}✓ Custom setup completed${NC}"
}

# Check requirements first
check_requirements

# Main menu loop
while true; do
    show_menu
    read -r opt

    case $opt in
        1)
            quick_start
            break
            ;;
        2)
            custom_setup
            break
            ;;
        3)
            ./scripts/validate-test-setup.sh
            break
            ;;
        4)
            if [ -f "src/tests/README.md" ]; then
                if command -v less &> /dev/null; then
                    less src/tests/README.md
                else
                    cat src/tests/README.md
                fi
            else
                echo -e "${RED}Documentation not found${NC}"
            fi
            ;;
        0)
            echo -e "\n${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done

echo -e "\n${BLUE}What's next?${NC}"
echo "1. Read the documentation in src/tests/README.md"
echo "2. Run 'npm run test:toolkit' to start testing"
echo "3. Check out example tests in src/tests/examples"
echo -e "\n${GREEN}Happy testing!${NC}"

# Make the script executable
chmod +x scripts/start-testing.sh
