#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Source logger
source ./scripts/test-logger.sh

# Chart constants
CHART_WIDTH=50
CHART_HEIGHT=15

# Function to generate ASCII bar chart
generate_bar_chart() {
  local title="$1"
  local -n data=$2
  local max=0
  local bar_char="█"

  # Find maximum value
  for value in "${data[@]}"; do
    if (( value > max )); then
      max=$value
    fi
  done

  # Print chart title
  echo -e "\n$title"
  echo "----------------------------------------"

  # Print bars
  for key in "${!data[@]}"; do
    local value=${data[$key]}
    local bar_length=$(( value * CHART_WIDTH / max ))
    printf "%-20s |" "$key"
    printf "%${bar_length}s" "" | tr ' ' "$bar_char"
    printf " %d\n" "$value"
  done
}

# Function to generate ASCII line graph
generate_line_graph() {
  local title="$1"
  local -n points=$2
  local max=0
  local min=${points[0]}

  # Find max and min values
  for value in "${points[@]}"; do
    if (( value > max )); then
      max=$value
    fi
    if (( value < min )); then
      min=$value
    fi
  done

  # Print graph title
  echo -e "\n$title"
  echo "----------------------------------------"

  # Generate y-axis and plot
  for (( y=CHART_HEIGHT-1; y>=0; y-- )); do
    local level=$(( min + (max - min) * y / (CHART_HEIGHT-1) ))
    printf "%4d |" $level

    for value in "${points[@]}"; do
      local point_height=$(( (value - min) * (CHART_HEIGHT-1) / (max - min) ))
      if (( point_height == y )); then
        echo -n "●"
      elif (( point_height > y )); then
        echo -n "│"
      else
        echo -n " "
      fi
    done
    echo
  done

  # Print x-axis
  printf "%4s +" "0"
  printf "%${#points[@]}s\n" | tr ' ' '-'
}

# Function to generate coverage visualization
visualize_coverage() {
  local report_file="$REPORT_DIR/coverage-visual-$(date +"%Y%m%d").txt"
  echo "Coverage Visualization" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Extract coverage data
  declare -A coverage
  local coverage_file=$(find coverage -name "coverage-summary.json" -type f | sort | tail -n 1)

  if [[ -f "$coverage_file" ]]; then
    coverage["Statements"]=$(jq -r '.total.statements.pct' "$coverage_file")
    coverage["Branches"]=$(jq -r '.total.branches.pct' "$coverage_file")
    coverage["Functions"]=$(jq -r '.total.functions.pct' "$coverage_file")
    coverage["Lines"]=$(jq -r '.total.lines.pct' "$coverage_file")

    # Generate coverage bars
    for metric in "${!coverage[@]}"; do
      local value=${coverage[$metric]}
      local bar_length=$(( value * CHART_WIDTH / 100 ))
      printf "%-12s |" "$metric" >> "$report_file"
      printf "%${bar_length}s" "" | tr ' ' '█' >> "$report_file"
      printf " %.1f%%\n" "$value" >> "$report_file"
    done
  else
    echo "No coverage data found" >> "$report_file"
  fi

  echo -e "${GREEN}Coverage visualization generated: $report_file${NC}"
}

# Function to generate performance visualization
visualize_performance() {
  local log_file="$1"
  local report_file="$REPORT_DIR/performance-visual-$(date +"%Y%m%d").txt"
  echo "Performance Visualization" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Extract test durations
  declare -A durations
  while IFS= read -r line; do
    if [[ $line =~ Duration:\ ([0-9]+)ms ]]; then
      local duration="${BASH_REMATCH[1]}"
      local range=$((duration / 100 * 100))
      ((durations[$range]++))
    fi
  done < <(grep "Duration:" "$log_file")

  # Generate histogram
  echo -e "\nTest Duration Distribution:" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  for range in $(echo "${!durations[@]}" | tr ' ' '\n' | sort -n); do
    local count=${durations[$range]}
    local bar_length=$(( count * CHART_WIDTH / $(echo "${durations[@]}" | tr ' ' '+' | bc) ))
    printf "%4dms |" "$range" >> "$report_file"
    printf "%${bar_length}s" "" | tr ' ' '█' >> "$report_file"
    printf " %d\n" "$count" >> "$report_file"
  done

  echo -e "${GREEN}Performance visualization generated: $report_file${NC}"
}

# Function to generate error visualization
visualize_errors() {
  local log_file="$1"
  local report_file="$REPORT_DIR/errors-visual-$(date +"%Y%m%d").txt"
  echo "Error Visualization" > "$report_file"
  echo "Generated: $(date)" >> "$report_file"
  echo "----------------------------------------" >> "$report_file"

  # Extract error categories
  declare -A errors
  while IFS= read -r line; do
    if [[ $line =~ ERROR:.*timeout ]]; then
      ((errors["Timeout"]++))
    elif [[ $line =~ ERROR:.*assertion ]]; then
      ((errors["Assertion"]++))
    elif [[ $line =~ ERROR:.*type ]]; then
      ((errors["Type"]++))
    else
      ((errors["Other"]++))
    fi
  done < <(grep "ERROR:" "$log_file")

  # Generate visualization
  generate_bar_chart "Error Distribution" errors >> "$report_file"

  echo -e "${GREEN}Error visualization generated: $report_file${NC}"
}

# Show menu
show_menu() {
  echo -e "\n${BLUE}Report Visualization Tools${NC}"
  echo "1. Visualize Coverage"
  echo "2. Visualize Performance"
  echo "3. Visualize Errors"
  echo "4. Generate All Visualizations"
  echo "5. View Visualizations"
  echo "0. Exit"
  echo -e "\nChoose an option:"
}

# Main loop
while true; do
  show_menu
  read -r opt

  case $opt in
    1)
      visualize_coverage
      ;;
    2)
      visualize_performance "$LOG_FILE"
      ;;
    3)
      visualize_errors "$LOG_FILE"
      ;;
    4)
      visualize_coverage
      visualize_performance "$LOG_FILE"
      visualize_errors "$LOG_FILE"
      ;;
    5)
      if [ -d "$REPORT_DIR" ]; then
        echo -e "\n${BLUE}Available visualizations:${NC}"
        ls -1 "$REPORT_DIR"/*visual*
        echo -e "\nEnter visualization name to view (or press Enter to cancel):"
        read -r viz_name
        if [ -n "$viz_name" ] && [ -f "$viz_name" ]; then
          less "$viz_name"
        fi
      else
        echo -e "${RED}No visualizations found${NC}"
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

  echo -e "\nPress Enter to continue"
  read -r
done

# Make the script executable
chmod +x scripts/visualize-reports.sh
