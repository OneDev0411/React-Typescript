import {
  QueryFunction,
  QueryKey,
  useQuery as useQueryOriginal,
  UseQueryOptions,
  UseQueryResult
} from 'react-query'

/**
 * For now we just wrap `useQuey` without any changes
 */
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, TError> {
  return useQueryOriginal<TQueryFnData, TError, TData, TQueryKey>(
    queryKey,
    queryFn,
    options
  )
}
