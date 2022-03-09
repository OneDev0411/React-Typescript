import { useSelector } from 'react-redux'

import { selectActiveBrandUnsafe } from '@app/selectors/brand'

export function useUnsafeActiveBrand(): ReturnType<
  typeof selectActiveBrandUnsafe
> {
  const unsafeActiveBrand = useSelector(selectActiveBrandUnsafe)

  return unsafeActiveBrand
}
