import {
  useQueryClient,
  MutationFunction,
  UseMutationOptions as UseMutationOptionsOriginal,
  UseMutationResult,
  useMutation as useMutationOriginal,
  QueryKey
} from 'react-query'

import { useQueryNotify, NotifyOptions } from './notify'

export interface UseMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends Omit<
    UseMutationOptionsOriginal<TData, TError, TVariables, TContext>,
    'mutationFn'
  > {
  notify?: NotifyOptions<TData, TError>
  invalidates?:
    | QueryKey[]
    | ((data: TData, variables: TVariables, context: TContext) => QueryKey[])
}

export function useMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
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

    const invalidates =
      typeof options?.invalidates === 'function'
        ? options?.invalidates(data, variables, context)
        : options?.invalidates

    invalidates?.forEach?.(key => queryClient.invalidateQueries(key))

    return options?.onSuccess?.(data, variables, context)
  }

  return useMutationOriginal(mutationFn, {
    ...options,
    onError,
    onSuccess
  })
}
