import { lazy, Suspense } from 'react'

const Editor = lazy(() => import('./Editor'))

export function EditorDialog(props) {
  return (
    <Suspense fallback={null}>
      <Editor {...props} />
    </Suspense>
  )
}
