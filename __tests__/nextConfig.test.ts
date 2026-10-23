import nextConfig from '../next.config'

type Rewrite = { source: string; destination: string }
const rewrites = nextConfig.rewrites as () => Promise<Rewrite[]>

describe('next.config rewrites (dev API proxy)', () => {
  const original = process.env.BACKEND_PROXY_TARGET

  afterEach(() => {
    if (original === undefined) delete process.env.BACKEND_PROXY_TARGET
    else process.env.BACKEND_PROXY_TARGET = original
  })

  it('should not proxy anything when BACKEND_PROXY_TARGET is not set', async () => {
    delete process.env.BACKEND_PROXY_TARGET
    expect(await rewrites()).toEqual([])
  })

  it.each(['http://api.localhost', 'http://api.localhost/'])(
    'should proxy /api/* to the backend when BACKEND_PROXY_TARGET is %p',
    async (target) => {
      process.env.BACKEND_PROXY_TARGET = target
      expect(await rewrites()).toEqual([
        { source: '/api/:path*', destination: 'http://api.localhost/:path*' },
      ])
    }
  )
})
