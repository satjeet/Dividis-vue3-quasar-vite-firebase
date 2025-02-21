#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Source other scripts
source ./scripts/test-logger.sh
source ./scripts/validate-test-setup.sh
source ./scripts/fix-test-setup.sh
source ./scripts/analyze-logs.sh
source ./scripts/visualize-reports.sh

# Constants
TOOLKIT_VERSION="1.0.0"
CONFIG_FILE=".test-toolkit-config"

# Load configuration
load_config() {
  if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
  else
    # Default configuration
    echo "# Test Toolkit Configuration
REPORT_DIR=test-reports
LOG_DIR=test-logs
BACKUP_DIR=test-setup-backups
CHART_WIDTH=50
CHART_HEIGHT=15
MAX_LOG_FILES=5
LOG_RETENTION_DAYS=30
VERBOSE=false" > "$CONFIG_FILE"
    source "$CONFIG_FILE"
  fi
}

# Show toolkit banner
show_banner() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════╗"
  echo "║           Test Toolkit v$TOOLKIT_VERSION          ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
}

# Show main menu
show_main_menu() {
  echo -e "\n${BLUE}Test Toolkit Main Menu${NC}"
  echo "1. Environment Management"
  echo "2. Test Execution"
  echo "3. Analysis & Reports"
  echo "4. Visualization Tools"
  echo "5. Maintenance Tools"
  echo "6. Configuration"
  echo "7. Help & Documentation"
  echo "0. Exit"
  echo -e "\nChoose an option:"
}

# Environment management menu
environment_menu() {
  while true; do
    echo -e "\n${BLUE}Environment Management${NC}"
    echo "1. Setup test environment"
    echo "2. Validate setup"
    echo "3. Fix issues"
    echo "4. Backup configuration"
    echo "5. Restore backup"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) ./scripts/setup-test-env.sh ;;
      2) ./scripts/validate-test-setup.sh ;;
      3) ./scripts/fix-test-setup.sh ;;
      4) backup_config ;;
      5) restore_backup ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Test execution menu
test_menu() {
  while true; do
    echo -e "\n${BLUE}Test Execution${NC}"
    echo "1. Run all tests"
    echo "2. Run specific test"
    echo "3. Watch mode"
    echo "4. Coverage report"
    echo "5. UI mode"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) npm test ;;
      2)
        echo "Enter test file pattern:"
        read -r pattern
        npm test -- "$pattern"
        ;;
      3) npm run test:watch ;;
      4) npm run test:coverage ;;
      5) npm run test:ui ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Analysis menu
analysis_menu() {
  while true; do
    echo -e "\n${BLUE}Analysis & Reports${NC}"
    echo "1. Generate summary report"
    echo "2. Generate performance report"
    echo "3. Generate error analysis"
    echo "4. Generate coverage trends"
    echo "5. Generate stability report"
    echo "6. Generate all reports"
    echo "7. View reports"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) generate_summary "$LOG_FILE" ;;
      2) generate_performance_report "$LOG_FILE" ;;
      3) generate_error_analysis "$LOG_FILE" ;;
      4) generate_coverage_trends ;;
      5) generate_stability_report "$LOG_FILE" ;;
      6)
        generate_summary "$LOG_FILE"
        generate_performance_report "$LOG_FILE"
        generate_error_analysis "$LOG_FILE"
        generate_coverage_trends
        generate_stability_report "$LOG_FILE"
        ;;
      7) view_reports ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Visualization menu
visualization_menu() {
  while true; do
    echo -e "\n${BLUE}Visualization Tools${NC}"
    echo "1. Visualize coverage"
    echo "2. Visualize performance"
    echo "3. Visualize errors"
    echo "4. Generate all visualizations"
    echo "5. View visualizations"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) visualize_coverage ;;
      2) visualize_performance "$LOG_FILE" ;;
      3) visualize_errors "$LOG_FILE" ;;
      4)
        visualize_coverage
        visualize_performance "$LOG_FILE"
        visualize_errors "$LOG_FILE"
        ;;
      5) view_visualizations ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Maintenance menu
maintenance_menu() {
  while true; do
    echo -e "\n${BLUE}Maintenance Tools${NC}"
    echo "1. Clean test artifacts"
    echo "2. Rotate logs"
    echo "3. Clean old logs"
    echo "4. Export logs"
    echo "5. Search logs"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) clean_tests ;;
      2) rotate_logs "test-manager-" ;;
      3) clean_old_logs ;;
      4) export_logs ;;
      5) search_logs ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Configuration menu
config_menu() {
  while true; do
    echo -e "\n${BLUE}Configuration${NC}"
    echo "1. View current configuration"
    echo "2. Edit configuration"
    echo "3. Reset to defaults"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) cat "$CONFIG_FILE" ;;
      2)
        if command -v nano >/dev/null 2>&1; then
          nano "$CONFIG_FILE"
        else
          vi "$CONFIG_FILE"
        fi
        ;;
      3)
        rm -f "$CONFIG_FILE"
        load_config
        ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Help menu
help_menu() {
  while true; do
    echo -e "\n${BLUE}Help & Documentation${NC}"
    echo "1. View Reference Guide"
    echo "2. View Troubleshooting Guide"
    echo "3. View Example Tests"
    echo "4. View README"
    echo "0. Back"
    echo -e "\nChoose an option:"
    read -r opt

    case $opt in
      1) less src/tests/REFERENCE.md ;;
      2) less src/tests/TROUBLESHOOTING.md ;;
      3) less src/tests/examples/setup-usage.test.ts ;;
      4) less src/tests/README.md ;;
      0) return ;;
      *) echo -e "${RED}Invalid option${NC}" ;;
    esac
  done
}

# Initialize
load_config
init_logging

# Main loop
while true; do
  clear
  show_banner
  show_main_menu
  read -r opt

  case $opt in
    1) environment_menu ;;
    2) test_menu ;;
    3) analysis_menu ;;
    4) visualization_menu ;;
    5) maintenance_menu ;;
    6) config_menu ;;
    7) help_menu ;;
    0)
      echo -e "\n${GREEN}Thank you for using Test Toolkit!${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid option${NC}"
      ;;
  esac
done

# Make the script executable
chmod +x scripts/test-toolkit.sh
