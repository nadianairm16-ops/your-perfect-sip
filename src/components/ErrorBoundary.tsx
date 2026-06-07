import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen items-center justify-center bg-cream p-4 text-center">
          <div className="max-w-xl rounded-[2rem] border border-coffee/10 bg-white/95 p-10 shadow-soft">
            <h1 className="text-3xl font-semibold text-coffee">Something went wrong</h1>
            <p className="mt-4 text-sm leading-7 text-coffee/75">
              The app ran into an issue while loading. Refresh the page or try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex rounded-full bg-coffee px-6 py-3 text-sm font-semibold text-cream transition hover:bg-coffee/90"
            >
              Reload app
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
