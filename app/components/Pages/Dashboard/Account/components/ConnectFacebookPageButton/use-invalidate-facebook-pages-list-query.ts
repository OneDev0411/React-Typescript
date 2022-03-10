import { useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'

import { list } from '@app/models/facebook/query-keys'
import { selectActiveBrandId } from '@app/selectors/brand'

type UseInvalidateFacebookPagesListQuery = () => void

export function useInvalidateFacebookPagesListQuery(): UseInvalidateFacebookPagesListQuery {
  const queryClient = useQueryClient()
  const activeBrandId = useSelector(selectActiveBrandId)

  return () => queryClient.invalidateQueries(list(activeBrandId))
}
