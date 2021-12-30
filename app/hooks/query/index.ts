import { useCallback } from 'react'

import { useQuery as useQueryOriginal, UseQueryOptions } from 'react-query'

import useNotify from '@app/hooks/use-notify'

interface Options<T extends any, E extends Error>
  extends UseQueryOptions<T, E> {
  notifyOnError?: boolean
}

export function useQuery<T extends any, E extends Error>(
  queryKey: string,
  fn: () => Promise<T>,
  {
    notifyOnError = false,
    onError: passedOnError,
    ...otherOptions
  }: Options<T, E>
) {
  const notify = useNotify()

  const onError = useCallback(
    (error: E) => {
      if (notifyOnError) {
        notify({ message: error.message, status: 'error' })
      }

      passedOnError?.(error)
    },
    [notifyOnError, notify, passedOnError]
  )

  return useQueryOriginal<T, E>(queryKey, fn, {
    ...otherOptions,
    onError
  })
}
