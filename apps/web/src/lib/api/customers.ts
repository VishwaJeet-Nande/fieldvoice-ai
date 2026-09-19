import { api } from './client'

export interface CustomerApiResponse<T> {
  data: T
}

export async function getCustomers<T>() {
  return api.get<CustomerApiResponse<T>>('/api/customers')
}

export async function getCustomer<T>(customerId: string) {
  return api.get<CustomerApiResponse<T>>(
    `/api/customers/${customerId}`,
  )
}

export async function getCustomerIntelligence<T>(customerId: string) {
  return api.get<CustomerApiResponse<T>>(
    `/api/customers/${customerId}/intelligence`,
  )
}
