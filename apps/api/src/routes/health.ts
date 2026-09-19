import type { FastifyInstance } from 'fastify'

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'fieldvoice-api',
      timestamp: new Date().toISOString()
    }
  })
}
