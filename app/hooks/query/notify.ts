import useNotify from '@app/hooks/use-notify'

export interface NotifyOptions<TData, TError> {
  onSuccess: string | ((data: TData) => string)
  onError: string | ((error: TError) => string)
}

/**
 * @returns error and success actions. both will be noop if options is undefined
 */
export function useQueryNotify<TData, TError>(
  options: NotifyOptions<TData, TError> | undefined
) {
  const notify = useNotify()

  return {
    error(error: TError) {
      if (!options) {
        return
      }

      let message: string | undefined

      if (typeof options.onError === 'string') {
        message = options.onError
      } else if (typeof options.onError === 'function') {
        message = options.onError(error)
      }

      if (message) {
        notify({
          status: 'error',
          message
        })
      }
    },

    success(data: TData) {
      if (!options) {
        return
      }

      let message: string | undefined

      if (typeof options.onSuccess === 'string') {
        message = options.onSuccess
      } else if (typeof options.onSuccess === 'function') {
        message = options.onSuccess(data)
      }

      if (message) {
        notify({
          status: 'success',
          message
        })
      }
    }
  }
}
