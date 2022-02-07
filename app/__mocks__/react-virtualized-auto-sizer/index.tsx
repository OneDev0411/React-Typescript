import { ReactNode } from 'react'

interface ReactVirtualizedAutoSizerProps {
  children: ({ width, height }: { width: number; height: number }) => ReactNode
}

function ReactVirtualizedAutoSizer({
  children
}: ReactVirtualizedAutoSizerProps) {
  return <>{children({ width: 1, height: 1 })}</>
}

export default ReactVirtualizedAutoSizer
