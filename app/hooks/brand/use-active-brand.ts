import { useSelector } from 'react-redux'

import { selectActiveBrand } from '@app/selectors/brand'

export function useActiveBrand(): ReturnType<typeof selectActiveBrand> {
  const activeBrand = useSelector(selectActiveBrand)

  return activeBrand
}
