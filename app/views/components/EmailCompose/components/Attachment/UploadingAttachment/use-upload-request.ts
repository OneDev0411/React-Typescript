import { SuperAgentRequest } from 'superagent'
import { useEffect, useRef, useState } from 'react'

interface UseUploadRequestArgs {
  request: SuperAgentRequest
  onFinish: (file: IFile) => void
  onError: (error: any) => void
}

/**
 * starts a super agent request and reports back it's progress
 */
export function useUploadRequest({
  request,
  onFinish,
  onError
}: UseUploadRequestArgs) {
  const [progress, setProgress] = useState<number | null>(null)

  /**
   * We don't want to trigger the effect when callbacks are changed
   * and we don't care about their changes, except we always want the latest
   * value. So we capture it in a ref
   */
  const callbacksRef = useRef({
    onError,
    onFinish
  })

  callbacksRef.current = {
    onError,
    onFinish
  }

  useEffect(() => {
    const handleError = error => {
      setProgress(null)
      callbacksRef.current.onError(error)
    }

    setProgress(0)

    request.on('progress', (progressEvent: ProgressEvent) => {
      const percentage =
        (progressEvent.total ? progressEvent.loaded / progressEvent.total : 0) *
        100

      setProgress(progressEvent.lengthComputable ? percentage : null)
    })

    request
      .then(response => {
        callbacksRef.current.onFinish(response.body.data)
      })
      .catch(handleError)

    return () => {
      // In current UX this is good, but we may need to change this
      request.abort()
    }
  }, [request])

  return { progress }
}
