import Fastify from 'fastify'
import sensible from '@fastify/sensible'

import { env } from './config/env.js'
import { registerCors } from './plugins/cors.js'
import { healthRoutes } from './routes/health.js'
import prismaPlugin from './plugins/prisma.js'
import { customerRoutes } from './routes/customers.js'
import { visitRoutes } from './routes/visits.js'
import { voiceRoutes } from './routes/voice.js'

async function buildServer() {
  const app = Fastify({
    logger: true
  })

  await app.register(sensible)
  await app.register(prismaPlugin)

  await registerCors(app)

  await app.register(healthRoutes, {
    prefix: '/api'
  })

  await app.register(customerRoutes, {
    prefix: '/api'
  })
  
  await app.register(visitRoutes, { prefix: '/api' })

  await app.register(voiceRoutes, { prefix: '/api' })

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error)

    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
        ? error.statusCode
        : 500

    const code =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
        ? error.code
        : 'INTERNAL_SERVER_ERROR'

    const message =
      statusCode < 500 &&
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Internal server error'

    return reply.status(statusCode).send({
      error: {
        code,
        message
      }
    })
  })

  return app
}

async function start() {
  const app = await buildServer()

  try {
    await app.listen({
      port: env.API_PORT,
      host: '0.0.0.0'
    })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()