// Базовая функция запросов. Адрес сервера не указываем:
// в разработке /api проксируется на :8080 (vite.config.ts),
// на защите сайт и API отдаются с одного адреса.

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError(
      0,
      'network',
      'Не удалось связаться с сервером. Проверьте, что он запущен.',
    )
  }

  if (!res.ok) {
    let code = 'unknown'
    let message = `Ошибка сервера (${res.status})`
    try {
      const body = (await res.json()) as { error?: string; message?: string }
      if (body.error) code = body.error
      if (body.message) message = body.message
    } catch {
      // тело не JSON: оставляем сообщение по умолчанию
    }
    throw new ApiError(res.status, code, message)
  }
  return (await res.json()) as T
}
