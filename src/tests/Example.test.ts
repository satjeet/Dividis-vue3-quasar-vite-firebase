import { mount, createRouterMock } from './helpers'
import { defineComponent } from 'vue'

// Test component using defineComponent for better type inference
const TestComponent = defineComponent({
  name: 'TestComponent',
  props: {
    message: {
      type: String,
      default: 'Default'
    }
  },
  template: '<div>{{ message }}</div>'
})

// Basic tests without relying on vitest types
test('component renders correctly', () => {
  const wrapper = mount(TestComponent)
  expect(wrapper.text()).toBe('Default')
})

test('component accepts props', () => {
  const wrapper = mount(TestComponent, {
    props: {
      message: 'Test Message'
    }
  })
  expect(wrapper.text()).toBe('Test Message')
})

test('mocks work correctly', () => {
  const router = createRouterMock()
  router.push('/test')
  expect(router.push.calls.length).toBe(1)
  expect(router.push.calls[0]).toEqual(['/test'])
})

test('renders with different messages', () => {
  const messages = ['Hello', 'World', 'Test']

  messages.forEach(msg => {
    const wrapper = mount(TestComponent, {
      props: { message: msg }
    })
    expect(wrapper.text()).toBe(msg)
    wrapper.unmount()
  })
})
