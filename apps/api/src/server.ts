import Fastify from 'fastify'
import sensible from '@fastify/sensible'

import { env } from './config/env.js'
import { registerCors } from './plugins/cors.js'
import prismaPlugin from './plugins/prisma.js'

import { healthRoutes } from './routes/health.js'
import { customerRoutes } from './routes/customers.js'
import { visitRoutes } from './routes/visits.js'
import { voiceRoutes } from './routes/voice.js'
import { alertRoutes } from './routes/alerts.js'
import { activityRoutes } from './routes/activity.js'

import { startSocketServer } from './realtime/socket.js'

async function buildServer() {
  const app = Fastify({ logger: true })

  await app.register(sensible)

  await registerCors(app)

  await app.register(prismaPlugin)

  await app.register(healthRoutes, {
    prefix: '/api',
  })

  await app.register(customerRoutes, {
    prefix: '/api',
  })

  await app.register(visitRoutes, {
    prefix: '/api',
  })

  await app.register(voiceRoutes, {
    prefix: '/api',
  })

  await app.register(alertRoutes, {
    prefix: '/api',
  })

  await app.register(activityRoutes, {
    prefix: '/api',
  })

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
        message,
      },
    })
  })

  return app
}

async function start() {
  const app = await buildServer()

  try {
    await app.listen({
      port: env.API_PORT,
      host: '0.0.0.0',
    })

    startSocketServer(env.SOCKET_PORT)

    app.log.info(
      `API server listening on ${env.API_PORT}`,
    )
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()