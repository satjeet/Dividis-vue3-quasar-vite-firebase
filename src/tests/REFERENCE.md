# Test Toolkit Reference Guide

## Command Reference

### Core Commands

```bash
# Start the test toolkit
npm run test:toolkit

# Initialize test environment
npm run test:init

# Validate setup
npm run test:validate

# Fix common issues
npm run test:fix

# Analyze test results
npm run test:analyze

# Visualize test data
npm run test:visualize
```

### Script Usage

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Individual script usage
./scripts/test-toolkit.sh      # Main interface
./scripts/init-test-tools.sh   # Initialize environment
./scripts/validate-test-setup.sh # Validate configuration
./scripts/fix-test-setup.sh    # Fix common issues
./scripts/analyze-logs.sh      # Analyze test results
./scripts/visualize-reports.sh # Generate visualizations
./scripts/test-logger.sh      # Logging utilities
./scripts/cleanup-test-tools.sh # Clean up tools
./scripts/start-testing.sh     # Quick start guide
```

## Configuration

### Configuration File (.test-toolkit-config)

```bash
# Test Toolkit Configuration
TEST_DIR=src/tests            # Test directory
REPORT_DIR=test-reports       # Report output directory
LOG_DIR=test-logs            # Log file directory
BACKUP_DIR=test-setup-backups # Backup directory
CHART_WIDTH=50               # Chart width for visualizations
CHART_HEIGHT=15             # Chart height for visualizations
MAX_LOG_FILES=5             # Maximum number of log files to keep
LOG_RETENTION_DAYS=30       # Days to keep log files
VERBOSE=false               # Enable verbose logging
```

### Environment Variables

```bash
# Optional environment overrides
export TEST_TOOLKIT_DIR=/custom/path    # Custom installation directory
export TEST_TOOLKIT_CONFIG=/path/to/config # Custom config location
export TEST_TOOLKIT_VERBOSE=true        # Enable verbose mode
```

## Test Utilities

### Assertions

```typescript
import { TestAssertions } from '../config'

// Assert async operation completes
await TestAssertions.assertCompletes(async () => {
  // async operation
}, { timeout: 5000 })

// Assert type safety
TestAssertions.assertType<User>(data, isUser)

// Assert mock calls
TestAssertions.assertMockCalls(mock, ['expected', 'args'])

// Assert error messages
TestAssertions.assertError(error, 'Expected message')
```

### Mocks

```typescript
import { createMock } from '../config'

// Create typed mock
const mock = createMock<(id: number) => string>()

// Configure mock
mock.mockReturnValue('result')
mock.mockResolvedValue('async result')
mock.mockRejectedValue(new Error('failure'))

// Verify calls
expect(mock).toHaveBeenCalledWith(1)
expect(mock).toHaveBeenCalledTimes(1)
```

### Async Utilities

```typescript
import { waitFor, delay } from '../config'

// Wait for condition
await waitFor(() => condition, {
  timeout: 5000,
  interval: 100
})

// Delay execution
await delay(1000)

// Retry operation
await withRetry(async () => {
  // operation that might fail
}, retries = 3)
```

## Test Organization

### Directory Structure

```
src/tests/
├── components/     # Component tests
├── composables/    # Composable tests
├── services/      # Service tests
├── utils/         # Test utilities
├── types/         # TypeScript types
├── config/        # Test configuration
└── examples/      # Example tests
```

### File Naming

```
Component Tests:    ComponentName.test.ts
Composable Tests:   useComposableName.test.ts
Service Tests:      ServiceName.test.ts
Unit Tests:         feature.test.ts
Integration Tests:  feature.spec.ts
```

## Writing Tests

### Component Tests

```typescript
import { mount } from '@vue/test-utils'
import { TestAssertions } from '../config'

describe('ComponentName', () => {
  it('handles user interaction', async () => {
    const wrapper = mount(Component, {
      props: { required: true }
    })

    await wrapper.find('button').trigger('click')
    await TestAssertions.assertCompletes(async () => {
      expect(wrapper.emitted()).toHaveProperty('click')
    })
  })
})
```

### Composable Tests

```typescript
import { TestAssertions } from '../config'

describe('useComposable', () => {
  it('manages state', async () => {
    const { result } = useComposable()

    await TestAssertions.assertCompletes(async () => {
      expect(result.value).toBeDefined()
    })
  })
})
```

### Service Tests

```typescript
import { createMock, TestAssertions } from '../config'

describe('ServiceName', () => {
  it('handles operations', async () => {
    const mock = createMock<ApiClient>()
    const service = new Service(mock)

    await TestAssertions.assertCompletes(async () => {
      const result = await service.operation()
      expect(result).toBeDefined()
    })
  })
})
```

## Logging and Analysis

### Log Levels

```typescript
// In your tests
import { log } from '../config'

log.info('Information message')
log.warning('Warning message')
log.error('Error message')
log.success('Success message')
```

### Analysis Tools

```bash
# Generate reports
./scripts/analyze-logs.sh

# Available reports:
- Summary Report
- Performance Report
- Error Analysis
- Coverage Trends
- Stability Report
```

### Visualizations

```bash
# Generate visualizations
./scripts/visualize-reports.sh

# Available visualizations:
- Coverage Charts
- Performance Histograms
- Error Distribution
- Test Execution Trends
```

## Best Practices

### Test Structure

```typescript
describe('Feature', () => {
  // Setup/teardown
  beforeAll(() => {})
  afterAll(() => {})
  beforeEach(() => {})
  afterEach(() => {})

  // Grouping
  describe('Scenario', () => {
    it('should behave correctly', async () => {
      // Arrange
      const setup = {}

      // Act
      const result = await operation()

      // Assert
      expect(result).toBeDefined()
    })
  })
})
```

### Error Handling

```typescript
// Test error scenarios
it('handles errors', async () => {
  await expect(async () => {
    await operation()
  }).rejects.toThrow('Expected error')
})

// Use error boundaries
TestAssertions.assertError(error, {
  message: 'Expected message',
  type: 'TypeError'
})
```

### Performance Tips

1. Use selective test runs
2. Optimize setup/teardown
3. Mock heavy operations
4. Clean up resources
5. Monitor execution times

## Integration

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup
        run: ./scripts/init-test-tools.sh
      - name: Test
        run: npm run test:toolkit
```

### Reporting Integration

```typescript
// Custom reporter
const reporter = {
  onTestComplete: (result) => {
    log.info(`Test completed: ${result.name}`)
  },
  onSuiteComplete: (suite) => {
    log.info(`Suite completed: ${suite.name}`)
  }
}

// Configure in vitest.config.ts
export default defineConfig({
  test: {
    reporters: [reporter]
  }
})
```

## Contributing

### Development Setup

```bash
# Clone repository
git clone <repo>

# Install dependencies
npm install

# Initialize test toolkit
./scripts/start-testing.sh

# Run tests
npm run test:toolkit
```

### Pull Request Guidelines

1. Add tests for new features
2. Update documentation
3. Follow coding standards
4. Include test results
5. Update CHANGELOG.md

## Support

For issues and questions:

1. Check TROUBLESHOOTING.md
2. Generate diagnostic report:
   ```bash
   ./scripts/test-toolkit.sh
   # Select option 3 (Analysis & Reports)
   ```
3. Open issue with:
   - Test logs
   - Configuration
   - Environment details
   - Steps to reproduce
