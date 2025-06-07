import { describe, it, expect } from 'vitest'
import router from '../src/router/index'

// Helper to initialize router before each test
const initRouter = async (path: string) => {
  router.push(path)
  await router.isReady()
  return router.currentRoute.value
}

describe('router', () => {
  it('resolves /HomeApply', async () => {
    const route = await initRouter('/HomeApply')
    expect(route.matched).toHaveLength(1)
    expect(route.matched[0].path).toBe('/HomeApply')
  })
})
