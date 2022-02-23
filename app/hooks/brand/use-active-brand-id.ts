import { useActiveBrand } from './use-active-brand'

export function useActiveBrandId(): UUID {
  const activeBrand = useActiveBrand()

  return activeBrand.id
}
