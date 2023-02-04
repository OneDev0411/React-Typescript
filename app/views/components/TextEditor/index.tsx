import React, { Suspense, lazy } from 'react'

const Editor = lazy(() => import('./Editor'))

export function TextEditor(props) {
  return (
    <Suspense fallback={null}>
      <Editor {...props} />
    </Suspense>
  )
}
