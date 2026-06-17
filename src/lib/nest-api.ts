export class NestApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown) {
    const message =
      typeof (payload as { error?: unknown })?.error === 'string'
        ? (payload as { error: string }).error
        : `Nest API request failed with status ${status}`

    super(message)
    this.name = 'NestApiError'
    this.status = status
    this.payload = payload
  }
}

export function getNestApiConfig(): NestApiConfig {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is required for Nest API calls')
  }

  return { baseUrl: baseUrl.replace(/\/$/, '') }
}

type NestApiConfig = {
  baseUrl: string
}

type NestApiRequestParams = {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  cache?: RequestCache
  credentials?: RequestCredentials
  timeoutMs?: number
}

export async function nestApiRequest<T>(params: NestApiRequestParams): Promise<T> {
  const { baseUrl } = getNestApiConfig()

  const normalizedPath = params.path.startsWith('/') ? params.path : `/${params.path}`
  const url = `${baseUrl}${normalizedPath}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs ?? 12000)

  try {
    const hasBody = params.body !== undefined
    const baseHeaders: HeadersInit = hasBody ? { 'content-type': 'application/json' } : {}

    const res = await fetch(url, {
      method: params.method ?? 'GET',
      headers: { ...baseHeaders, ...(params.headers ?? {}) },
      ...(hasBody ? { body: JSON.stringify(params.body) } : {}),
      cache: params.cache,
      credentials: params.credentials ?? 'include',
      signal: controller.signal,
    })

    const raw = await res.text()
    const payload = raw.length > 0 ? safeParseJson(raw) : null

    if (!res.ok) {
      throw new NestApiError(res.status, payload)
    }

    return (payload ?? ({} as T)) as T
  } finally {
    clearTimeout(timeout)
  }
}

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return { error: raw }
  }
}
