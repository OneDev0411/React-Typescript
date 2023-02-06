import { Suspense, lazy } from 'react'

const Editor = lazy(() => import('./Editor'))

export const TextEditor = props => {
  return (
    <Suspense fallback={null}>
      <Editor {...props} />
    </Suspense>
  )
}
