'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  fallback: React.ReactNode
}
interface State {
  hasError: boolean
}

// Error boundary: si el WebGL falla, muestra el fallback en vez de romper la página.
export class WebGLErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }
  componentDidCatch() {
    /* silencioso: es un efecto decorativo */
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// Fallback estático con el degradado de la marca (crema · dorado).
export function WebGLFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ background: 'linear-gradient(140deg, #f6f1e7, #e8d3a6 55%, #c9913d)' }}
      aria-hidden="true"
    />
  )
}
