import React, { ReactNode } from 'react'

import LoadingContainer from '../LoadingContainer'
import { ServerError } from '../ServerError'

interface Props {
  loading: boolean
  error: any
  onRetry: () => void
  children: ReactNode
}

/**
 * To be used for a unified UX for showing loading, error, and retry experience
 * when a piece of UI needs some data.
 */
export function AsyncValueContainer({
  loading,
  error,
  onRetry,
  children
}: Props) {
  if (loading) {
    return <LoadingContainer style={{ minHeight: '15rem', flex: 1 }} />
  }

  if (error) {
    return <ServerError error={error} onRetry={onRetry} />
  }

  if (typeof children === 'function') {
    return children()
  }

  return children
}
