const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
  status: number
  code?: string

  constructor(
    message: string,
    status: number,
    code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      body?.error?.message ?? 'Something went wrong'

    throw new ApiError(
      message,
      response.status,
      body?.error?.code,
    )
  }

  return body as T
}

export const api = {
  get<T>(path: string) {
    return request<T>(path)
  },

  post<T>(path: string, data?: unknown) {
    return request<T>(path, {
      method: 'POST',
      body: data === undefined ? undefined : JSON.stringify(data),
    })
  },

  patch<T>(path: string, data?: unknown) {
    return request<T>(path, {
      method: 'PATCH',
      body: data === undefined ? undefined : JSON.stringify(data),
    })
  },
}