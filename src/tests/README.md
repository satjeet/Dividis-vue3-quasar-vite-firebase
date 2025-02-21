# Test Toolkit Documentation

## Overview

The Test Toolkit is a comprehensive suite of tools for managing, executing, analyzing, and visualizing tests in your Vue.js project. It provides an integrated environment for all testing needs through an easy-to-use command-line interface.

## Installation

1. Make all scripts executable:
```bash
chmod +x scripts/*.sh
```

2. Initialize the test environment:
```bash
./scripts/test-toolkit.sh
```

## Main Features

### 1. Environment Management
- Setup test environment
- Validate configuration
- Fix common issues
- Backup/restore configuration
- Automated dependency management

### 2. Test Execution
- Run all tests
- Run specific tests
- Watch mode
- Coverage reports
- UI mode for visual testing

### 3. Analysis & Reports
- Summary reports
- Performance analysis
- Error tracking
- Coverage trends
- Stability reports

### 4. Visualization Tools
- Coverage visualization
- Performance charts
- Error distribution
- Trend analysis
- ASCII-based charts

### 5. Maintenance Tools
- Clean test artifacts
- Rotate logs
- Clean old logs
- Export/import logs
- Search functionality

### 6. Configuration
- Customizable settings
- Environment-specific configs
- Easy configuration editor
- Reset to defaults

## Directory Structure

```
scripts/
├── test-toolkit.sh      # Main entry point
├── analyze-logs.sh      # Log analysis tools
├── fix-test-setup.sh    # Setup fixes
├── setup-test-env.sh    # Environment setup
├── test-logger.sh       # Logging utilities
├── test-manager.sh      # Test management
├── validate-test-setup.sh # Setup validation
└── visualize-reports.sh  # Visualization tools

src/tests/
├── config/             # Test configuration
├── examples/           # Example tests
├── utils/             # Test utilities
├── types/             # TypeScript types
├── REFERENCE.md       # Reference guide
└── TROUBLESHOOTING.md # Troubleshooting guide
```

## Configuration

The toolkit uses a `.test-toolkit-config` file for configuration:

```bash
# Test Toolkit Configuration
REPORT_DIR=test-reports
LOG_DIR=test-logs
BACKUP_DIR=test-setup-backups
CHART_WIDTH=50
CHART_HEIGHT=15
MAX_LOG_FILES=5
LOG_RETENTION_DAYS=30
VERBOSE=false
```

## Usage Examples

### 1. Basic Test Execution
```bash
# Start the toolkit
./scripts/test-toolkit.sh

# Select option 2 for Test Execution
# Then select option 1 to run all tests
```

### 2. Generate Reports
```bash
# Start the toolkit
./scripts/test-toolkit.sh

# Select option 3 for Analysis & Reports
# Then select option 6 to generate all reports
```

### 3. Visualize Results
```bash
# Start the toolkit
./scripts/test-toolkit.sh

# Select option 4 for Visualization Tools
# Then select option 4 to generate all visualizations
```

## Test Utilities

### Assertions
```typescript
import { TestAssertions } from '@test/utils/test-helpers'

// Assert error
TestAssertions.assertError(error, 'Expected error message')

// Assert mock calls
TestAssertions.assertMockCalls(mock, ['expected', 'args'])

// Assert async operations
await TestAssertions.assertCompletes(async () => {
  // async operation
})
```

### Mocks
```typescript
import { createMock } from '@test/utils/test-helpers'

const mock = createMock<(id: number) => string>()
mock.mockReturnValue('result')
```

### Async Utilities
```typescript
import { delay, waitFor } from '@test/utils/test-helpers'

// Wait for condition
await waitFor(() => condition, { timeout: 1000 })

// Delay execution
await delay(100)
```

## Logs and Reports

### Log Types
- Test execution logs
- Error logs
- Performance logs
- Coverage reports
- Backup logs

### Report Types
- Summary reports
- Performance reports
- Error analysis
- Coverage trends
- Stability reports

### Visualizations
- Coverage charts
- Performance histograms
- Error distribution
- Trend graphs
- ASCII-based visualizations

## Best Practices

1. **Test Organization**
   - Keep tests in `src/tests` directory
   - Use descriptive test names
   - Group related tests

2. **Configuration Management**
   - Use environment-specific configs
   - Backup configurations regularly
   - Document custom settings

3. **Performance**
   - Clean old logs regularly
   - Rotate logs to manage space
   - Monitor test execution times

4. **Maintenance**
   - Run validations regularly
   - Fix issues promptly
   - Keep dependencies updated

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

For detailed reference, see [REFERENCE.md](./REFERENCE.md).

## Contributing

1. Review the example tests
2. Follow the coding standards
3. Add tests for new features
4. Update documentation
5. Submit pull requests

## License

MIT License. See LICENSE file for details.
