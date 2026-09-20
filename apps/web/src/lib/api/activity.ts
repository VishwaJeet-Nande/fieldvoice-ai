import { api } from './client'

export interface ActivityApiResponse<T> {
  data: T
}

export async function getActivity<T>(limit = 50) {
  return api.get<ActivityApiResponse<T>>(
    `/api/activity?limit=${limit}`,
  )
}

export async function getCustomerActivity<T>(
  customerId: string,
  limit = 50,
) {
  return api.get<ActivityApiResponse<T>>(
    `/api/activity?customerId=${customerId}&limit=${limit}`,
  )
}