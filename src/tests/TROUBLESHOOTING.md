# Test Toolkit Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### 1. Scripts Not Executable
```bash
Error: Permission denied
```

**Solution:**
```bash
chmod +x scripts/*.sh
```

#### 2. Missing Dependencies
```bash
Error: Cannot find module '@vue/test-utils'
```

**Solution:**
```bash
# Run fix script
./scripts/fix-test-setup.sh

# Or install manually
npm install -D @vue/test-utils@next @vue/compiler-dom vitest vitest-environment-jsdom
```

#### 3. jq Not Found
```bash
Error: jq: command not found
```

**Solution:**
- On Ubuntu/Debian: `sudo apt-get install jq`
- On macOS: `brew install jq`
- On Windows: `choco install jq`

### Configuration Issues

#### 1. Invalid Configuration
```bash
Error: Could not read configuration file
```

**Solution:**
```bash
# Reset configuration to defaults
./scripts/test-toolkit.sh
# Select option 6 (Configuration)
# Select option 3 (Reset to defaults)
```

#### 2. Wrong Paths
```bash
Error: Directory not found: src/tests
```

**Solution:**
```bash
# Run initialization script
./scripts/init-test-tools.sh
```

#### 3. Permission Issues
```bash
Error: EACCES: permission denied, access 'test-logs'
```

**Solution:**
```bash
# Fix directory permissions
sudo chown -R $(whoami) test-logs test-reports test-setup-backups
```

### Test Execution Issues

#### 1. Tests Not Found
```bash
Error: No test files found
```

**Solution:**
1. Check test file naming: should end with `.test.ts` or `.spec.ts`
2. Verify test directory structure
3. Update vitest.config.ts include patterns

#### 2. Type Errors
```bash
Error: Cannot find module '@types/...'
```

**Solution:**
```bash
# Install missing type definitions
npm install -D @types/node @types/jest
```

#### 3. Test Timeouts
```bash
Error: Test timed out in 5000ms
```

**Solution:**
1. Increase timeout in config:
```bash
# Edit .test-toolkit-config
TIMEOUT=10000
```

2. Use longer timeout in specific test:
```typescript
it('long test', async () => {
  await TestAssertions.assertCompletes(async () => {
    // test code
  }, { timeout: 10000 })
})
```

### Visualization Issues

#### 1. Charts Not Displaying
```bash
Error: Invalid chart dimensions
```

**Solution:**
Adjust chart dimensions in config:
```bash
# Edit .test-toolkit-config
CHART_WIDTH=80
CHART_HEIGHT=20
```

#### 2. Report Generation Fails
```bash
Error: Could not generate report
```

**Solution:**
1. Check directory permissions
2. Ensure log files exist
3. Run cleanup:
```bash
./scripts/cleanup-test-tools.sh
# Select option 3 (Remove test files only)
# Then reinitialize
./scripts/init-test-tools.sh
```

### Log Management Issues

#### 1. Log Files Too Large
```bash
Error: Disk space warning
```

**Solution:**
```bash
# Edit .test-toolkit-config
MAX_LOG_FILES=3
LOG_RETENTION_DAYS=7

# Then run log rotation
./scripts/test-toolkit.sh
# Select option 5 (Maintenance Tools)
# Select option 2 (Rotate logs)
```

#### 2. Missing Log Data
```bash
Error: No logs found for analysis
```

**Solution:**
1. Enable verbose logging:
```bash
# Edit .test-toolkit-config
VERBOSE=true
```

2. Run tests again with logging:
```bash
npm run test:toolkit
```

### Vue Component Testing Issues

#### 1. Component Mount Fails
```bash
Error: Failed to mount component
```

**Solution:**
1. Check component imports
2. Ensure Vue Test Utils is properly configured:
```typescript
// In src/tests/setup.ts
import { config } from '@vue/test-utils'
config.global.stubs = {}
```

#### 2. Event Handling Issues
```bash
Error: Event was not emitted
```

**Solution:**
```typescript
// Use async event handling
await wrapper.find('button').trigger('click')
await nextTick()
expect(wrapper.emitted()).toHaveProperty('click')
```

### Backup and Restore Issues

#### 1. Backup Failed
```bash
Error: Could not create backup
```

**Solution:**
1. Check disk space
2. Verify permissions
3. Try manual backup:
```bash
./scripts/test-toolkit.sh
# Select option 1 (Environment Management)
# Select option 4 (Backup configuration)
```

#### 2. Restore Failed
```bash
Error: Could not restore from backup
```

**Solution:**
1. Verify backup exists
2. Check file permissions
3. Try manual restore:
```bash
./scripts/cleanup-test-tools.sh
# Select option 7 (Restore from backup)
```

## Performance Optimization

### 1. Slow Test Execution
If tests are running slowly:

1. Use selective test runs:
```bash
npm test -- src/tests/specific-test.test.ts
```

2. Optimize test setup:
```typescript
// Use beforeAll instead of beforeEach when possible
beforeAll(() => {
  // Setup code
})
```

### 2. High Memory Usage
If experiencing memory issues:

1. Run garbage collection between tests:
```typescript
afterEach(() => {
  if (global.gc) global.gc()
})
```

2. Clean up test artifacts:
```bash
./scripts/cleanup-test-tools.sh
# Select option 6 (Clean test artifacts)
```

## Getting Help

If you're still experiencing issues:

1. Check the logs:
```bash
./scripts/test-toolkit.sh
# Select option 3 (Analysis & Reports)
# Select option 1 (Generate summary report)
```

2. Generate a diagnostic report:
```bash
./scripts/test-toolkit.sh
# Select option 4 (Visualization Tools)
# Select option 4 (Generate All Visualizations)
```

3. Contact support with:
- Test logs
- Configuration file
- Generated reports
- Error messages
- System information
