#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log directory and file
LOG_DIR="test-logs"
LOG_FILE="$LOG_DIR/test-manager-$(date +"%Y%m%d").log"
ERROR_LOG="$LOG_DIR/errors-$(date +"%Y%m%d").log"
BACKUP_LOG="$LOG_DIR/backups.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Logging functions
log_info() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] INFO: $*" | tee -a "$LOG_FILE"
}

log_error() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] ERROR: $*" | tee -a "$ERROR_LOG"
  echo -e "[$timestamp] ERROR: $*" >> "$LOG_FILE"
}

log_warning() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] WARNING: $*" | tee -a "$LOG_FILE"
}

log_success() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] SUCCESS: $*" | tee -a "$LOG_FILE"
}

log_backup() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "[$timestamp] BACKUP: $*" >> "$BACKUP_LOG"
  echo -e "[$timestamp] BACKUP: $*" >> "$LOG_FILE"
}

# Test execution logging
log_test_execution() {
  local test_file="$1"
  local status="$2"
  local duration="$3"
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")

  echo -e "[$timestamp] TEST: $test_file (Status: $status, Duration: ${duration}ms)" >> "$LOG_FILE"
}

# Environment state logging
log_environment_state() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "\n[$timestamp] ENVIRONMENT STATE:" >> "$LOG_FILE"

  # Node version
  echo "Node: $(node -v)" >> "$LOG_FILE"

  # npm version
  echo "npm: $(npm -v)" >> "$LOG_FILE"

  # Dependencies
  echo "Dependencies:" >> "$LOG_FILE"
  npm list --depth=0 >> "$LOG_FILE" 2>&1

  # Test files count
  echo "Test files: $(find src/tests -name "*.test.ts" | wc -l)" >> "$LOG_FILE"
}

# Operation timing
start_timer() {
  OPERATION_START=$(date +%s%N)
}

end_timer() {
  local operation="$1"
  local end_time=$(date +%s%N)
  local duration=$(((end_time - OPERATION_START) / 1000000)) # Convert to milliseconds
  echo -e "[$operation] Duration: ${duration}ms" >> "$LOG_FILE"
}

# Log file rotation
rotate_logs() {
  local max_files=5
  local log_pattern="$1"

  # Get list of log files sorted by date
  local files=($(ls -t "$LOG_DIR"/$log_pattern* 2>/dev/null))

  # Remove oldest files if we have more than max_files
  if [ ${#files[@]} -gt $max_files ]; then
    for ((i=$max_files; i<${#files[@]}; i++)); do
      rm "${files[i]}"
      log_info "Removed old log file: ${files[i]}"
    done
  fi
}

# Clean old logs
clean_old_logs() {
  local days=30
  find "$LOG_DIR" -name "*.log" -type f -mtime +$days -delete
  log_info "Cleaned logs older than $days days"
}

# View logs function
view_logs() {
  echo -e "\n${BLUE}Available logs:${NC}"
  ls -1 "$LOG_DIR"

  echo -e "\nEnter log file name to view (or press Enter to cancel):"
  read -r log_name

  if [ -z "$log_name" ]; then
    return 0
  fi

  if [ ! -f "$LOG_DIR/$log_name" ]; then
    echo -e "${RED}Log file not found${NC}"
    return 1
  fi

  # Use less if available, otherwise cat
  if command -v less >/dev/null 2>&1; then
    less "$LOG_DIR/$log_name"
  else
    cat "$LOG_DIR/$log_name"
  fi
}

# Log search function
search_logs() {
  echo -e "\nEnter search term:"
  read -r search_term

  if [ -z "$search_term" ]; then
    return 0
  fi

  echo -e "\n${BLUE}Searching logs for: $search_term${NC}"
  grep -r "$search_term" "$LOG_DIR"
}

# Export logs
export_logs() {
  local export_dir="test-logs-export-$(date +"%Y%m%d_%H%M%S")"
  mkdir -p "$export_dir"

  cp -r "$LOG_DIR"/* "$export_dir/"
  tar -czf "${export_dir}.tar.gz" "$export_dir"
  rm -rf "$export_dir"

  echo -e "${GREEN}Logs exported to ${export_dir}.tar.gz${NC}"
}

# Initialize logging
init_logging() {
  log_info "Test manager session started"
  log_environment_state
  rotate_logs "test-manager-"
  rotate_logs "errors-"
}

# Make the script executable
chmod +x scripts/test-logger.sh
