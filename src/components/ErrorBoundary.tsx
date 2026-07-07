import { Component, type ErrorInfo, type ReactNode } from "react"

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="card max-w-md text-center">
            <h1 className="text-lg font-bold text-acai-900">Algo deu errado</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Recarregue a página e tente novamente. Se o problema continuar, limpe o cache do
              navegador.
            </p>
            <p className="mt-3 break-all text-xs text-zinc-400">{this.state.error.message}</p>
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
