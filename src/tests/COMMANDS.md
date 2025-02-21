# Test Toolkit Commands Guide

## Initial Setup

```bash
# Initialize testing environment
./scripts/init-test-tools.sh

# Validate setup
./scripts/validate-test-setup.sh
```

## Basic Test Commands

```bash
# Run all tests
npm run test:toolkit

# Run specific test file
npm test src/tests/CategoryService.test.ts

# Run tests in watch mode
npm run test:toolkit -- --watch

# Run tests with coverage
npm run test:toolkit -- --coverage
```

## Analysis Commands

```bash
# Analyze test results
./scripts/analyze-logs.sh

# View test reports
./scripts/visualize-reports.sh

# Verify toolkit status
./scripts/verify-toolkit.sh

# Generate complete report
./scripts/generate-toolkit-report.sh
```

## Interactive Menu

```bash
# Launch test toolkit menu
./scripts/test-toolkit.sh
```

Available options:
1. Environment Management
2. Test Execution
3. Analysis & Reports
4. Visualization Tools
5. Maintenance Tools
6. Configuration
7. Help & Documentation

## Quick Start

```bash
# Quick setup and test
./scripts/start-testing.sh
```

## Maintenance Commands

```bash
# Clean test artifacts
./scripts/cleanup-test-tools.sh

# Fix common issues
./scripts/fix-test-setup.sh

# Check PR readiness
./scripts/check-pr.sh
```

## Advanced Options

### Coverage Report

```bash
# Generate detailed coverage
npm run test:toolkit -- --coverage --reporter=verbose

# View coverage report
npm run test:toolkit -- --coverage --reporter=html
```

### Performance Testing

```bash
# Run performance tests
npm run test:toolkit -- --perf

# Generate performance report
./scripts/analyze-logs.sh --perf
```

### Test Filtering

```bash
# Run tests matching pattern
npm run test:toolkit -- --testNamePattern="CategoryService"

# Run specific test suite
npm run test:toolkit -- src/tests/components/
```

## Environment Variables

```bash
# Enable verbose logging
VERBOSE=true npm run test:toolkit

# Set test environment
TEST_ENV=ci npm run test:toolkit

# Run with debugger
DEBUG=true npm run test:toolkit
```

## CI/CD Commands

```bash
# Validate PR
./scripts/check-pr.sh

# Generate release report
./scripts/generate-toolkit-report.sh

# Verify complete setup
./scripts/verify-toolkit.sh
