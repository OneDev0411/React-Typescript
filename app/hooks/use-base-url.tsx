import { useLocation } from 'react-use'

export function useBaseUrl() {
  const location = useLocation()

  return location.origin
}
