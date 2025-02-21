# Test Toolkit Quick Start Guide

## 1. Initial Setup
```bash
# Initialize test environment and tools
./scripts/init-test-tools.sh
```

## 2. Basic Test Commands

### Run All Tests
```bash
npm run test:toolkit
```

### Test Specific Components
```bash
# Test PilarSentences
npm test src/tests/components/PilarSentences.test.ts

# Test Category functionality
npm test src/tests/CategoryService.test.ts
```

### Watch Mode Development
```bash
# Watch all tests
npm run test:toolkit -- --watch

# Watch specific component
npm run test:toolkit -- --watch src/tests/components/PilarSentences.test.ts
```

## 3. Common Test Patterns

### Component Test
```typescript
import { mount } from '@vue/test-utils'
import PilarSentences from '@/components/PilarSentences.vue'

it('should render sentences', () => {
  const wrapper = mount(PilarSentences, {
    props: { sentences: ['Test'] }
  })
  expect(wrapper.text()).toContain('Test')
})
```

### Service Test
```typescript
import { CategoryService } from '@/services/CategoryService'

it('should manage categories', async () => {
  const service = new CategoryService()
  const categories = await service.getCategories()
  expect(categories).toBeDefined()
})
```

### Firebase Test
```typescript
import { FirebaseService } from '@/services/FirebaseService'

it('should interact with Firebase', async () => {
  const service = new FirebaseService()
  const data = await service.getData()
  expect(data).toBeDefined()
})
```

## 4. Troubleshooting

### Test Setup Issues
```bash
# Validate test setup
./scripts/validate-test-setup.sh

# Fix common issues
./scripts/fix-test-setup.sh
```

### Test Analysis
```bash
# Generate test report
./scripts/analyze-logs.sh

# View test visualizations
./scripts/visualize-reports.sh
```

## 5. Coverage Check
```bash
# Run tests with coverage
npm run test:toolkit -- --coverage
```

## 6. Interactive Menu
```bash
# Launch test toolkit menu
./scripts/test-toolkit.sh
```

## 7. Generate Report
```bash
# Generate comprehensive report
./scripts/generate-toolkit-report.sh
```

## Additional Resources

- Detailed commands: see `src/tests/COMMANDS.md`
- Full reference: see `src/tests/REFERENCE.md`
- Troubleshooting: see `src/tests/TROUBLESHOOTING.md`
- Example tests: see `src/tests/examples/test-examples.md`

## Next Steps

1. Run all tests: `npm run test:toolkit`
2. Check coverage: `npm run test:toolkit -- --coverage`
3. View reports: `./scripts/visualize-reports.sh`
4. Review examples: `src/tests/examples/`

Need help? Run: `./scripts/test-toolkit.sh` and select "Help & Documentation"
