import React, { ReactNode, Suspense } from 'react'

import type { MapboxProps } from 'components/Mapbox'

const Mapbox = React.lazy(() => import('components/Mapbox'))

export interface LazyMapboxProps extends MapboxProps {
  loadingFallback?: ReactNode
}

function LazyMapbox({
  loadingFallback = 'loading...',
  ...otherProps
}: LazyMapboxProps) {
  return (
    <Suspense fallback={loadingFallback}>
      <Mapbox {...otherProps} />
    </Suspense>
  )
}

export default LazyMapbox
