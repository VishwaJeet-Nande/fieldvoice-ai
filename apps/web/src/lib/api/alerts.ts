import { api } from './client'

export interface AlertApiResponse<T> {
  data: T
}

export async function getAlerts<T>() {
  return api.get<AlertApiResponse<T>>('/api/alerts')
}

export async function getAlert<T>(alertId: string) {
  return api.get<AlertApiResponse<T>>(`/api/alerts/${alertId}`)
}