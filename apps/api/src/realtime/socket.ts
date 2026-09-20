import { createServer } from 'node:http'
import { Server } from 'socket.io'

export type ActivityEvent = {
  id: string
  type: string
  title: string
  description: string
  customerId?: string | null
  alertId?: string | null
  createdAt: string
}

let io: Server | null = null

export function startSocketServer(port: number) {
  const httpServer = createServer()

  io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`[socket] disconnected: ${socket.id}`)
    })
  })

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[socket] listening on ${port}`)
  })
}

export function emitActivity(event: ActivityEvent) {
  if (!io) {
    return
  }

  io.emit('activity:new', event)
}