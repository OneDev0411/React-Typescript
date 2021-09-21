import { useQueryParam } from '@app/hooks/use-query-param'

export function useGetOriginQueryParam(): string {
  const [origin] = useQueryParam('origin')

  if (!origin) {
    return ''
  }

  return `origin=${origin}`
}
