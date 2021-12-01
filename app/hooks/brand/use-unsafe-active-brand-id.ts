import { useUnsafeActiveBrand } from './use-unsafe-active-brand'

export function useUnsafeActiveBrandId(): Nullable<UUID> {
  const activeBrand = useUnsafeActiveBrand()

  return activeBrand?.id ?? null
}
