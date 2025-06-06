import { mount } from '@vue/test-utils'
import Filter from '../src/components/Filter.vue'
import { createStore } from 'vuex'
import { describe, it, expect, vi } from 'vitest'

const store = createStore({
  state() {
    return { category: 'APT', area: '전체' }
  },
  actions: {
    updateCategory: vi.fn(),
    updateArea: vi.fn()
  }
})

const factory = () => mount(Filter, {
  global: { plugins: [store] }
})

describe('Filter.vue', () => {
  it('renders default category', () => {
    const wrapper = factory()
    const select = wrapper.find('select#category')
    expect((select.element as HTMLSelectElement).value).toBe('APT')
  })
})
