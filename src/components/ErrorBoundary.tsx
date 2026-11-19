import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui'

interface Props {
  children: ReactNode
  // при смене адреса ошибка сбрасывается
  resetKey: string
}

interface State {
  error?: Error
  key: string
}

// Если страница упала, показываем сообщение вместо белого экрана
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { key: this.props.resetKey }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return props.resetKey !== state.key
      ? { key: props.resetKey, error: undefined }
      : null
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ошибка на странице:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ padding: '40px 0' }}>
        <h1>Что-то пошло не так</h1>
        <p className="page-lead">
          Страница не смогла отобразиться. Проверьте, что сервер запущен и
          обновлён.
        </p>
        <p className="muted" style={{ fontFamily: 'monospace', fontSize: 13 }}>
          {this.state.error.message}
        </p>
        <Button onClick={() => window.location.reload()}>
          Обновить страницу
        </Button>
      </div>
    )
  }
}
