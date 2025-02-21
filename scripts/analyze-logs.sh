#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Source logger
source ./scripts/test-logger.sh

# Report directory
REPORT_DIR="test-reports"
mkdir -p "$REPORT_DIR"

# Generate summary report
generate_summary() {
  local log_file="$1"
  local report_file="$REPORT_DIR/summary-$(date +"%Y%m%d").txt"

  echo "Test Execution Summary Report" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Count test executions
  echo -e "\nTest Executions:" >> "$report_file"
  grep "TEST:" "$log_file" | wc -l >> "$report_file"

  # Count errors
  echo -e "\nErrors:" >> "$report_file"
  grep "ERROR:" "$log_file" | wc -l >> "$report_file"

  # Average test duration
  echo -e "\nAverage Test Duration:" >> "$report_file"
  grep "Duration:" "$log_file" | awk '{sum += $NF; count++} END {print sum/count "ms"}' >> "$report_file"

  # Most frequent errors
  echo -e "\nMost Common Errors:" >> "$report_file"
  grep "ERROR:" "$log_file" | sort | uniq -c | sort -rn | head -5 >> "$report_file"

  echo -e "${GREEN}Summary report generated: $report_file${NC}"
}

# Generate performance report
generate_performance_report() {
  local log_file="$1"
  local report_file="$REPORT_DIR/performance-$(date +"%Y%m%d").txt"

  echo "Test Performance Report" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Slowest tests
  echo -e "\nSlowest Tests:" >> "$report_file"
  grep "Duration:" "$log_file" | sort -rn -k2 | head -10 >> "$report_file"

  # Performance trends
  echo -e "\nPerformance Trends:" >> "$report_file"
  grep "Duration:" "$log_file" | awk '{
    hour = substr($1, 1, 2)
    durations[hour] += $NF
    counts[hour]++
  } END {
    for (h in durations) {
      printf "%s:00 - Average: %.2fms\n", h, durations[h]/counts[h]
    }
  }' | sort >> "$report_file"

  echo -e "${GREEN}Performance report generated: $report_file${NC}"
}

# Generate error analysis
generate_error_analysis() {
  local log_file="$1"
  local report_file="$REPORT_DIR/errors-$(date +"%Y%m%d").txt"

  echo "Error Analysis Report" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Error categories
  echo -e "\nError Categories:" >> "$report_file"
  grep "ERROR:" "$log_file" | awk '{
    if ($0 ~ /timeout/) category["Timeout"]++
    else if ($0 ~ /assertion/) category["Assertion"]++
    else if ($0 ~ /type/) category["Type"]++
    else category["Other"]++
  } END {
    for (cat in category) {
      printf "%s: %d\n", cat, category[cat]
    }
  }' | sort -rn -k2 >> "$report_file"

  # Error timing patterns
  echo -e "\nError Timing Patterns:" >> "$report_file"
  grep "ERROR:" "$log_file" | awk '{
    hour = substr($1, 1, 2)
    errors[hour]++
  } END {
    for (h in errors) {
      printf "%s:00 - Errors: %d\n", h, errors[h]
    }
  }' | sort >> "$report_file"

  echo -e "${GREEN}Error analysis generated: $report_file${NC}"
}

# Generate coverage trends
generate_coverage_trends() {
  local report_file="$REPORT_DIR/coverage-trends-$(date +"%Y%m%d").txt"

  echo "Coverage Trends Report" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Find all coverage reports
  local coverage_files=($(find coverage -name "coverage-summary.json" -type f))

  for file in "${coverage_files[@]}"; do
    local date=$(stat -f "%Sm" -t "%Y-%m-%d" "$file")
    echo -e "\nCoverage for $date:" >> "$report_file"
    jq -r '.total | "\nStatements: \(.statements.pct)%\nBranches: \(.branches.pct)%\nFunctions: \(.functions.pct)%\nLines: \(.lines.pct)%"' "$file" >> "$report_file"
  done

  echo -e "${GREEN}Coverage trends report generated: $report_file${NC}"
}

# Generate test stability report
generate_stability_report() {
  local log_file="$1"
  local report_file="$REPORT_DIR/stability-$(date +"%Y%m%d").txt"

  echo "Test Stability Report" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Find flaky tests (tests with inconsistent results)
  echo -e "\nPotentially Flaky Tests:" >> "$report_file"
  grep "TEST:" "$log_file" | awk '{
    test=$3
    status=$5
    tests[test][status]++
  } END {
    for (t in tests) {
      if (length(tests[t]) > 1) {
        printf "%s:\n", t
        for (s in tests[t]) {
          printf "  %s: %d times\n", s, tests[t][s]
        }
      }
    }
  }' >> "$report_file"

  echo -e "${GREEN}Stability report generated: $report_file${NC}"
}

# Show menu
show_menu() {
  echo -e "\n${BLUE}Log Analysis Tools${NC}"
  echo "1. Generate Summary Report"
  echo "2. Generate Performance Report"
  echo "3. Generate Error Analysis"
  echo "4. Generate Coverage Trends"
  echo "5. Generate Stability Report"
  echo "6. Generate All Reports"
  echo "7. View Reports"
  echo "0. Exit"
  echo -e "\nChoose an option:"
}

# View reports function
view_reports() {
  echo -e "\n${BLUE}Available reports:${NC}"
  ls -1 "$REPORT_DIR"

  echo -e "\nEnter report name to view (or press Enter to cancel):"
  read -r report_name

  if [ -z "$report_name" ]; then
    return 0
  fi

  if [ ! -f "$REPORT_DIR/$report_name" ]; then
    echo -e "${RED}Report not found${NC}"
    return 1
  fi

  # Use less if available, otherwise cat
  if command -v less >/dev/null 2>&1; then
    less "$REPORT_DIR/$report_name"
  else
    cat "$REPORT_DIR/$report_name"
  fi
}

# Main loop
while true; do
  show_menu
  read -r opt

  case $opt in
    1)
      generate_summary "$LOG_FILE"
      ;;
    2)
      generate_performance_report "$LOG_FILE"
      ;;
    3)
      generate_error_analysis "$LOG_FILE"
      ;;
    4)
      generate_coverage_trends
      ;;
    5)
      generate_stability_report "$LOG_FILE"
      ;;
    6)
      generate_summary "$LOG_FILE"
      generate_performance_report "$LOG_FILE"
      generate_error_analysis "$LOG_FILE"
      generate_coverage_trends
      generate_stability_report "$LOG_FILE"
      ;;
    7)
      view_reports
      ;;
    0)
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
chmod +x scripts/analyze-logs.sh
