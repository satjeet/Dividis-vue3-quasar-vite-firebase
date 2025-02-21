#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup directory for safety
BACKUP_DIR="test-toolkit-backup-$(date +"%Y%m%d_%H%M%S")"

# Configuration
CONFIG_FILE=".test-toolkit-config"

# Function to show confirmation prompt
confirm() {
    read -p "$1 [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY]) true ;;
        *) false ;;
    esac
}

# Function to backup files
backup_files() {
    echo -e "${BLUE}Creating backup...${NC}"
    mkdir -p "$BACKUP_DIR"

    # Backup test files
    if [ -d "src/tests" ]; then
        cp -r src/tests "$BACKUP_DIR/"
    fi

    # Backup scripts
    if [ -d "scripts" ]; then
        cp -r scripts "$BACKUP_DIR/"
    fi

    # Backup configuration
    if [ -f "$CONFIG_FILE" ]; then
        cp "$CONFIG_FILE" "$BACKUP_DIR/"
    fi

    echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR${NC}"
}

# Function to remove npm scripts
remove_npm_scripts() {
    echo -e "\n${BLUE}Removing npm scripts...${NC}"

    SCRIPTS_TO_REMOVE=(
        "test:toolkit"
        "test:init"
        "test:fix"
        "test:validate"
        "test:analyze"
        "test:visualize"
    )

    for script in "${SCRIPTS_TO_REMOVE[@]}"; do
        if grep -q "\"$script\":" package.json; then
            # Use jq to remove the script
            jq "del(.scripts[\"$script\"])" package.json > tmp.$$ && mv tmp.$$ package.json
            echo -e "${GREEN}✓ Removed npm script: $script${NC}"
        fi
    done
}

# Function to remove test files
remove_test_files() {
    echo -e "\n${BLUE}Removing test files...${NC}"

    DIRECTORIES=(
        "src/tests"
        "test-reports"
        "test-logs"
        "test-setup-backups"
    )

    for dir in "${DIRECTORIES[@]}"; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            echo -e "${GREEN}✓ Removed directory: $dir${NC}"
        fi
    done

    if [ -f "$CONFIG_FILE" ]; then
        rm "$CONFIG_FILE"
        echo -e "${GREEN}✓ Removed configuration file${NC}"
    fi
}

# Function to remove script files
remove_script_files() {
    echo -e "\n${BLUE}Removing script files...${NC}"

    SCRIPTS=(
        "test-toolkit.sh"
        "test-logger.sh"
        "validate-test-setup.sh"
        "fix-test-setup.sh"
        "analyze-logs.sh"
        "visualize-reports.sh"
        "setup-test-env.sh"
        "test-manager.sh"
        "init-test-tools.sh"
        "cleanup-test-tools.sh"
    )

    for script in "${SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ]; then
            rm "scripts/$script"
            echo -e "${GREEN}✓ Removed script: $script${NC}"
        fi
    done
}

# Show menu
show_menu() {
    echo -e "\n${BLUE}Test Toolkit Cleanup${NC}"
    echo "1. Remove everything (with backup)"
    echo "2. Remove everything (no backup)"
    echo "3. Remove test files only"
    echo "4. Remove scripts only"
    echo "5. Remove npm scripts only"
    echo "6. Reset configuration"
    echo "7. Restore from backup"
    echo "0. Exit"
    echo -e "\nChoose an option:"
}

# Function to restore from backup
restore_from_backup() {
    echo -e "\n${BLUE}Available backups:${NC}"

    # List available backups
    backups=(test-toolkit-backup-*)
    if [ ${#backups[@]} -eq 0 ]; then
        echo -e "${RED}No backups found${NC}"
        return
    fi

    for i in "${!backups[@]}"; do
        echo "$((i+1)). ${backups[$i]}"
    done

    echo -e "\nEnter backup number to restore (or 0 to cancel):"
    read -r choice

    if [ "$choice" = "0" ] || [ -z "$choice" ]; then
        return
    fi

    index=$((choice-1))
    if [ "$index" -ge 0 ] && [ "$index" -lt "${#backups[@]}" ]; then
        backup_dir="${backups[$index]}"

        echo -e "${YELLOW}Warning: This will overwrite existing files${NC}"
        if confirm "Continue?"; then
            # Restore files
            if [ -d "$backup_dir/tests" ]; then
                cp -r "$backup_dir/tests" src/
            fi
            if [ -d "$backup_dir/scripts" ]; then
                cp -r "$backup_dir/scripts" ./
            fi
            if [ -f "$backup_dir/$CONFIG_FILE" ]; then
                cp "$backup_dir/$CONFIG_FILE" ./
            fi
            echo -e "${GREEN}✓ Restore completed${NC}"
        fi
    else
        echo -e "${RED}Invalid choice${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read -r opt

    case $opt in
        1)  # Remove everything with backup
            if confirm "This will remove all test toolkit files. Continue?"; then
                backup_files
                remove_npm_scripts
                remove_test_files
                remove_script_files
                echo -e "\n${GREEN}Cleanup completed with backup${NC}"
            fi
            ;;
        2)  # Remove everything without backup
            if confirm "This will permanently remove all test toolkit files. Continue?"; then
                remove_npm_scripts
                remove_test_files
                remove_script_files
                echo -e "\n${GREEN}Cleanup completed${NC}"
            fi
            ;;
        3)  # Remove test files only
            if confirm "Remove test files?"; then
                remove_test_files
            fi
            ;;
        4)  # Remove scripts only
            if confirm "Remove script files?"; then
                remove_script_files
            fi
            ;;
        5)  # Remove npm scripts only
            if confirm "Remove npm scripts?"; then
                remove_npm_scripts
            fi
            ;;
        6)  # Reset configuration
            if confirm "Reset configuration to defaults?"; then
                if [ -f "$CONFIG_FILE" ]; then
                    rm "$CONFIG_FILE"
                fi
                "./scripts/init-test-tools.sh"
            fi
            ;;
        7)  # Restore from backup
            restore_from_backup
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
chmod +x scripts/cleanup-test-tools.sh
