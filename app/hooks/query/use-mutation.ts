import {
  useQueryClient,
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
  useMutation as useMutationOriginal,
  QueryKey
} from 'react-query'

import { useQueryNotify, NotifyOptions } from './notify'

interface Options<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends UseMutationOptions<TData, TError, TVariables, TContext> {
  notify?: NotifyOptions<TData, TError>
  invalidates?: QueryKey[]
}

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<Options<TData, TError, TVariables, TContext>, 'mutationFn'>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const notify = useQueryNotify(options?.notify)
  const queryClient = useQueryClient()

  function onError(
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ): void | Promise<unknown> {
    // No-op if options.notify is undefined
    notify.error(error)

    return options?.onError?.(error, variables, context)
  }

  function onSuccess(
    data: TData,
    variables: TVariables,
    context: TContext
  ): void | Promise<unknown> {
    // No-op if options.notify is undefined
    notify.success(data)

    options?.invalidates?.forEach?.(key => queryClient.invalidateQueries(key))

    return options?.onSuccess?.(data, variables, context)
  }

  return useMutationOriginal(mutationFn, {
    ...options,
    onError,
    onSuccess
  })
}
