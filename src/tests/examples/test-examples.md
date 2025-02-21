# Test Examples Guide

## Component Tests

```bash
# Test PilarSentences component
npm test src/tests/components/PilarSentences.test.ts

# Test all components
npm run test:toolkit -- src/tests/components/
```

## Service Tests

```bash
# Test CategoryService
npm test src/tests/CategoryService.test.ts

# Test Firebase services
npm run test:toolkit -- src/tests/**/*Firebase*.test.ts
```

## Composable Tests

```bash
# Test Theme composable
npm test src/tests/composables/useTheme.test.ts

# Test all composables
npm run test:toolkit -- src/tests/composables/
```

## Example Test Patterns

### Testing Components
```typescript
import { mount } from '@vue/test-utils'
import PilarSentences from '@/components/PilarSentences.vue'

describe('PilarSentences', () => {
  it('displays sentences correctly', () => {
    const wrapper = mount(PilarSentences, {
      props: {
        sentences: ['Test sentence']
      }
    })
    expect(wrapper.text()).toContain('Test sentence')
  })
})
```

### Testing Services
```typescript
import { CategoryService } from '@/services/CategoryService'

describe('CategoryService', () => {
  it('manages categories correctly', async () => {
    const service = new CategoryService()
    const result = await service.getCategories()
    expect(result).toBeDefined()
  })
})
```

### Testing Composables
```typescript
import { useTheme } from '@/composables/useTheme'

describe('useTheme', () => {
  it('manages theme correctly', () => {
    const { theme, toggleTheme } = useTheme()
    expect(theme.value).toBeDefined()
  })
})
```

## Running Test Suites

### Complete Test Suite
```bash
# Run all tests
npm run test:toolkit

# Run with coverage
npm run test:toolkit -- --coverage
```

### Specific Features
```bash
# Test declarations feature
npm run test:toolkit -- --testNamePattern="Declaracion"

# Test Firebase integration
npm run test:toolkit -- --testNamePattern="Firebase"
```

### Watch Mode
```bash
# Watch specific component
npm run test:toolkit -- --watch src/tests/components/PilarSentences.test.ts

# Watch all Firebase related tests
npm run test:toolkit -- --watch src/tests/**/*Firebase*.test.ts
```

## Debugging Tests

```bash
# Run with debugger
DEBUG=true npm run test:toolkit

# Run specific test with debugger
DEBUG=true npm test src/tests/CategoryService.test.ts
```

## Performance Testing

```bash
# Test PilarSentences performance
npm run test:toolkit -- --perf src/tests/components/PilarSentences.test.ts

# Test all Firebase operations performance
npm run test:toolkit -- --perf src/tests/**/*Firebase*.test.ts
```

## Test Environment Variables

```bash
# Test with mock Firebase
MOCK_FIREBASE=true npm run test:toolkit

# Test with specific environment
TEST_ENV=staging npm run test:toolkit
```

## Generating Reports

```bash
# Generate component coverage report
npm run test:toolkit -- --coverage src/tests/components/

# Generate service performance report
npm run test:toolkit -- --perf src/tests/services/
```

## Common Patterns

### Testing Async Operations
```typescript
it('handles async operations', async () => {
  const result = await someFunctionThatReturnsPromise()
  expect(result).toBeDefined()
})
```

### Testing Events
```typescript
it('emits events correctly', async () => {
  const wrapper = mount(Component)
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('click')
})
```

### Testing Firebase Operations
```typescript
it('interacts with Firebase', async () => {
  const repository = new FirebaseRepository()
  const result = await repository.getData()
  expect(result).toBeDefined()
})
