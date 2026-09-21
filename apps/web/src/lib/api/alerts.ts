import { api } from './client'

export interface AlertApiResponse<T> {
  data: T
}

export type AlertStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'

export async function getAlerts<T>() {
  return api.get<AlertApiResponse<T>>('/api/alerts')
}

export async function getAlert<T>(alertId: string) {
  return api.get<AlertApiResponse<T>>(
    `/api/alerts/${alertId}`,
  )
}

export async function patchAlert<T>(
  alertId: string,
  status: AlertStatus,
) {
  return api.patch<AlertApiResponse<T>>(
    `/api/alerts/${alertId}`,
    { status },
  )
}