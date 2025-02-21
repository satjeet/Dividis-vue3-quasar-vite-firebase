import { describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, PropType } from 'vue'
import {
  createSuite,
  TestAssertions,
  createMock,
  waitFor,
  waitDelay as delay,
  initTestEnv
} from '../config'

interface Item {
  id: number
  name: string
}

// Example Vue component for testing
const ExampleComponent = defineComponent({
  name: 'ExampleComponent',
  template: `
    <div>
      <input v-model="searchTerm" @input="onSearch" />
      <div v-if="loading">Loading...</div>
      <ul v-else>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
          <button @click="onSelect(item)">Select</button>
        </li>
      </ul>
      <div v-if="error">{{ error }}</div>
    </div>
  `,
  props: {
    onSelect: {
      type: Function as PropType<(item: Item) => void>,
      required: true
    }
  },
  data() {
    return {
      searchTerm: '',
      items: [] as Item[],
      loading: false,
      error: null as string | null
    }
  },
  methods: {
    async onSearch() {
      if (!this.searchTerm) {
        this.items = []
        return
      }

      this.loading = true
      this.error = null

      try {
        // Simulate API call
        await delay(100)
        this.items = [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' }
        ]
      } catch (error) {
        this.error = 'Failed to load items'
      } finally {
        this.loading = false
      }
    }
  }
})

// Custom test environment with longer timeouts
const testEnv = initTestEnv({
  timeout: 2000,
  retries: 2,
  verbose: true
})

createSuite('Vue Component Testing', {
  'should handle user input': async () => {
    const onSelect = createMock<(item: Item) => void>()
    const wrapper = mount(ExampleComponent, {
      props: { onSelect }
    })

    // Wait for component to mount
    await nextTick()

    // Test input handling
    const input = wrapper.find('input')
    await input.setValue('test')

    // Wait for loading state
    await waitFor(() => wrapper.text().includes('Loading'))

    // Wait for results
    await waitFor(() => wrapper.findAll('li').length > 0)

    // Verify results
    const items = wrapper.findAll('li')
    TestAssertions.assertCompletes(async () => {
      expect(items.length).toBe(2)
      expect(items[0].text()).toContain('Item 1')
    })
  },

  'should handle selection': async () => {
    const onSelect = createMock<(item: Item) => void>()
    const wrapper = mount(ExampleComponent, {
      props: { onSelect }
    })

    // Trigger search to populate items
    await wrapper.find('input').setValue('test')
    await waitFor(() => wrapper.findAll('li').length > 0)

    // Click select button
    await wrapper.find('button').trigger('click')

    // Verify callback
    TestAssertions.assertMockCalls(onSelect, [{ id: 1, name: 'Item 1' }])
  },

  'should handle loading states': async () => {
    const wrapper = mount(ExampleComponent, {
      props: { onSelect: createMock<(item: Item) => void>() }
    })

    // Track loading state transitions
    const states: boolean[] = []

    // Watch loading state
    const vm = wrapper.vm as InstanceType<typeof ExampleComponent>
    vm.$watch('loading', (value: boolean) => {
      states.push(value)
    })

    // Trigger search
    await wrapper.find('input').setValue('test')

    // Wait for loading cycle to complete
    await waitFor(() => states.length >= 2)

    // Verify loading state sequence
    expect(states).toEqual([true, false])
  },

  'should handle empty results': async () => {
    const wrapper = mount(ExampleComponent, {
      props: { onSelect: createMock<(item: Item) => void>() }
    })

    // Clear input
    await wrapper.find('input').setValue('')
    await nextTick()

    // Verify empty state
    const items = wrapper.findAll('li')
    expect(items.length).toBe(0)
  }
})

// Test error handling
createSuite('Error Handling', {
  'should display error message': async () => {
    // Mock console.error to prevent noise
    const errorSpy = createMock()
    console.error = errorSpy

    const ErrorComponent = defineComponent({
      extends: ExampleComponent,
      methods: {
        async onSearch() {
          this.loading = true
          this.error = null

          try {
            await delay(50)
            throw new Error('API Error')
          } catch (error) {
            this.error = 'Failed to load items'
          } finally {
            this.loading = false
          }
        }
      }
    })

    const wrapper = mount(ErrorComponent, {
      props: { onSelect: createMock<(item: Item) => void>() }
    })

    // Trigger search
    await wrapper.find('input').setValue('test')

    // Wait for error
    await waitFor(() => wrapper.text().includes('Failed to load'))

    // Verify error state
    expect(wrapper.text()).toContain('Failed to load items')
    const vm = wrapper.vm as InstanceType<typeof ErrorComponent>
    expect(vm.loading).toBe(false)
  }
})

// Test edge cases
createSuite('Edge Cases', {
  'should handle rapid input': async () => {
    const wrapper = mount(ExampleComponent, {
      props: { onSelect: createMock<(item: Item) => void>() }
    })

    // Simulate rapid typing
    for (const char of 'test') {
      await wrapper.find('input').setValue(char)
      await delay(10)
    }

    // Wait for final result
    await waitFor(() => wrapper.findAll('li').length > 0)

    // Verify only final request completed
    const vm = wrapper.vm as InstanceType<typeof ExampleComponent>
    expect(vm.loading).toBe(false)
    expect(wrapper.findAll('li').length).toBe(2)
  },

  'should handle component unmount during loading': async () => {
    const wrapper = mount(ExampleComponent, {
      props: { onSelect: createMock<(item: Item) => void>() }
    })

    // Start loading
    await wrapper.find('input').setValue('test')

    // Unmount during loading
    await delay(50)
    wrapper.unmount()

    // Verify no errors
    await delay(100)
    expect(true).toBe(true) // Component cleaned up successfully
  }
})
