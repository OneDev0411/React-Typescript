import { useQueryClient } from 'react-query'

import { useActiveBrandId } from '@app/hooks/brand'
import { list } from '@app/models/facebook/query-keys'

type UseInvalidateFacebookPagesListQuery = () => void

export function useInvalidateFacebookPagesListQuery(): UseInvalidateFacebookPagesListQuery {
  const queryClient = useQueryClient()
  const activeBrandId = useActiveBrandId()

  return () => queryClient.invalidateQueries(list(activeBrandId))
}
