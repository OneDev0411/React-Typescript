import { useContext } from 'react'
import useUnmount from 'react-use/lib/useUnmount'

import { useInitializer } from 'hooks/use-initializer'
import { useLatestValueRef } from 'hooks/use-latest-value-ref'

import { EditorContext } from '..'

import { DropzonePropsInterceptor } from '../types'

export function useDropzonePropsInterceptor(
  interceptor: DropzonePropsInterceptor
) {
  const { addDropzonePropsInterceptor } = useContext(EditorContext)

  const interceptorRef = useLatestValueRef(interceptor)

  const cleanup = useInitializer(() =>
    addDropzonePropsInterceptor(props => interceptorRef.current(props))
  )

  useUnmount(cleanup)
}
