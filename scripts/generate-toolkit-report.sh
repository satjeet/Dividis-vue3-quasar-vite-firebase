#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Report file
REPORT_FILE="test-toolkit-report-$(date +"%Y%m%d-%H%M%S").md"

# Banner
generate_banner() {
  echo -e "${BLUE}"
  echo "╔════════════════════════════════════════╗"
  echo "║       Test Toolkit Status Report       ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
}

# Generate report header
generate_header() {
  echo "# Test Toolkit Status Report" > "$REPORT_FILE"
  echo "Generated: $(date)" >> "$REPORT_FILE"
  echo "----------------------------------------" >> "$REPORT_FILE"
}

# Check components
check_components() {
  echo -e "\n${BLUE}Checking Toolkit Components...${NC}"
  echo -e "\n## Component Status" >> "$REPORT_FILE"
  echo "| Component | Status | Version |" >> "$REPORT_FILE"
  echo "|-----------|--------|---------|" >> "$REPORT_FILE"

  # Core scripts
  local core_scripts=(
    "test-toolkit.sh"
    "init-test-tools.sh"
    "start-testing.sh"
    "verify-toolkit.sh"
  )

  for script in "${core_scripts[@]}"; do
    if [ -x "scripts/$script" ]; then
      echo -e "${GREEN}✓ Core script: $script${NC}"
      echo "| Core: $script | ✅ Active | $(get_version "$script") |" >> "$REPORT_FILE"
    else
      echo -e "${RED}✗ Missing core script: $script${NC}"
      echo "| Core: $script | ❌ Missing | - |" >> "$REPORT_FILE"
    fi
  done

  # Utility scripts
  local utils=(
    "analyze-logs.sh"
    "visualize-reports.sh"
    "test-logger.sh"
    "check-pr.sh"
  )

  for util in "${utils[@]}"; do
    if [ -x "scripts/$util" ]; then
      echo -e "${GREEN}✓ Utility: $util${NC}"
      echo "| Utility: $util | ✅ Active | $(get_version "$util") |" >> "$REPORT_FILE"
    else
      echo -e "${RED}✗ Missing utility: $util${NC}"
      echo "| Utility: $util | ❌ Missing | - |" >> "$REPORT_FILE"
    fi
  done
}

# Check documentation
check_documentation() {
  echo -e "\n${BLUE}Checking Documentation...${NC}"
  echo -e "\n## Documentation Status" >> "$REPORT_FILE"
  echo "| Document | Status | Last Updated |" >> "$REPORT_FILE"
  echo "|----------|--------|--------------|" >> "$REPORT_FILE"

  local docs=(
    "src/tests/README.md"
    "src/tests/REFERENCE.md"
    "src/tests/TROUBLESHOOTING.md"
    "CHANGELOG.md"
    "CONTRIBUTING.md"
  )

  for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
      local last_updated=$(git log -1 --format="%ad" -- "$doc" 2>/dev/null || echo "Unknown")
      echo -e "${GREEN}✓ Documentation: $doc${NC}"
      echo "| $doc | ✅ Present | $last_updated |" >> "$REPORT_FILE"
    else
      echo -e "${RED}✗ Missing documentation: $doc${NC}"
      echo "| $doc | ❌ Missing | - |" >> "$REPORT_FILE"
    fi
  done
}

# Check GitHub workflows
check_workflows() {
  echo -e "\n${BLUE}Checking GitHub Workflows...${NC}"
  echo -e "\n## GitHub Workflow Status" >> "$REPORT_FILE"
  echo "| Workflow | Status | Last Run |" >> "$REPORT_FILE"
  echo "|----------|--------|-----------|" >> "$REPORT_FILE"

  local workflows=(
    "test-toolkit-validation.yml"
    "test-toolkit-maintenance.yml"
    "test-toolkit-cleanup.yml"
    "test-toolkit-release.yml"
  )

  for workflow in "${workflows[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
      echo -e "${GREEN}✓ Workflow: $workflow${NC}"
      echo "| $workflow | ✅ Active | $(get_last_modified ".github/workflows/$workflow") |" >> "$REPORT_FILE"
    else
      echo -e "${RED}✗ Missing workflow: $workflow${NC}"
      echo "| $workflow | ❌ Missing | - |" >> "$REPORT_FILE"
    fi
  done
}

# Check test environment
check_test_environment() {
  echo -e "\n${BLUE}Checking Test Environment...${NC}"
  echo -e "\n## Test Environment Status" >> "$REPORT_FILE"

  # Check test configuration
  if [ -f ".test-toolkit-config" ]; then
    echo -e "${GREEN}✓ Test configuration present${NC}"
    echo "- ✅ Test configuration: Present" >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
    cat .test-toolkit-config >> "$REPORT_FILE"
    echo "\`\`\`" >> "$REPORT_FILE"
  else
    echo -e "${RED}✗ Test configuration missing${NC}"
    echo "- ❌ Test configuration: Missing" >> "$REPORT_FILE"
  fi

  # Check directories
  echo -e "\n### Directory Structure" >> "$REPORT_FILE"
  echo "\`\`\`" >> "$REPORT_FILE"
  tree -L 3 src/tests >> "$REPORT_FILE"
  echo "\`\`\`" >> "$REPORT_FILE"
}

# Get version from file
get_version() {
  local file="$1"
  grep -m1 "version=" "scripts/$file" 2>/dev/null | cut -d'"' -f2 || echo "Unknown"
}

# Get last modified date
get_last_modified() {
  local file="$1"
  stat -f "%Sm" "$file" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null || echo "Unknown"
}

# Generate statistics
generate_statistics() {
  echo -e "\n${BLUE}Generating Statistics...${NC}"
  echo -e "\n## Toolkit Statistics" >> "$REPORT_FILE"
  echo "- Total Scripts: $(find scripts -name "*.sh" | wc -l)" >> "$REPORT_FILE"
  echo "- Documentation Files: $(find . -name "*.md" | wc -l)" >> "$REPORT_FILE"
  echo "- GitHub Workflows: $(find .github/workflows -name "*.yml" | wc -l)" >> "$REPORT_FILE"
  echo "- Test Files: $(find src/tests -name "*.test.ts" | wc -l)" >> "$REPORT_FILE"
  echo "- Examples: $(find src/tests/examples -name "*.ts" | wc -l)" >> "$REPORT_FILE"
}

# Generate recommendations
generate_recommendations() {
  echo -e "\n${BLUE}Generating Recommendations...${NC}"
  echo -e "\n## Recommendations" >> "$REPORT_FILE"

  # Check coverage
  if [ -f "coverage/coverage-summary.json" ]; then
    local coverage=$(jq -r '.total.lines.pct' coverage/coverage-summary.json)
    if (( $(echo "$coverage < 80" | bc -l) )); then
      echo "- 🔴 Increase test coverage (currently $coverage%)" >> "$REPORT_FILE"
    fi
  fi

  # Check documentation age
  for doc in src/tests/*.md; do
    if [ -f "$doc" ]; then
      local days_old=$(( ($(date +%s) - $(date -r "$doc" +%s)) / 86400 ))
      if [ $days_old -gt 90 ]; then
        echo "- 🟡 Review and update $doc (last updated $days_old days ago)" >> "$REPORT_FILE"
      fi
    fi
  done

  # Check example freshness
  for example in src/tests/examples/*.ts; do
    if [ -f "$example" ]; then
      local days_old=$(( ($(date +%s) - $(date -r "$example" +%s)) / 86400 ))
      if [ $days_old -gt 90 ]; then
        echo "- 🟡 Update example $example (last updated $days_old days ago)" >> "$REPORT_FILE"
      fi
    fi
  done
}

# Main execution
generate_banner
generate_header
check_components
check_documentation
check_workflows
check_test_environment
generate_statistics
generate_recommendations

echo -e "\n${GREEN}Report generated: $REPORT_FILE${NC}"
echo -e "\nUse 'less $REPORT_FILE' to view the report"

# Make script executable
chmod +x scripts/generate-toolkit-report.sh
