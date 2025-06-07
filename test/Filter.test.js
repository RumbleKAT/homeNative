import { mount } from '@vue/test-utils'
import Filter from '../src/components/Filter.vue'
import { createStore } from 'vuex'

describe('Filter.vue', () => {
  const store = createStore({
    state() {
      return { category: 'APT', area: '전체' }
    },
    actions: {
      updateCategory: jest.fn(),
      updateArea: jest.fn()
    }
  })

  const factory = () => mount(Filter, {
    global: { plugins: [store] }
  })

  it('renders default category', () => {
    const wrapper = factory()
    const select = wrapper.find('select#category')
    expect(select.element.value).toBe('APT')
  })
})
