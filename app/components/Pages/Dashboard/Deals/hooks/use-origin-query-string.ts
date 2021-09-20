import { useQueryParam } from '@app/hooks/use-query-param'

export function useOriginQueryString(): string {
  const [origin] = useQueryParam('origin')

  if (!origin) {
    return ''
  }

  return `?origin=${origin}`
}
