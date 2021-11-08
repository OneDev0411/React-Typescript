import { useCallback } from 'react'

import { useEffectOnce } from 'react-use'

import useAsync from '@app/hooks/use-async'
import { getTriggers } from '@app/models/instant-marketing/global-triggers'

export interface UseGetGlobalTriggers {
  isLoading: boolean
  globalTriggers: IGlobalTrigger[]
  reload: () => void
}

export function useGetGlobalTriggers(brandId: UUID): UseGetGlobalTriggers {
  const {
    isLoading,
    data: globalTriggers,
    run
  } = useAsync<IGlobalTrigger[]>({
    data: [],
    status: 'pending'
  })
  const loadTriggers = useCallback(
    () => run(() => getTriggers(brandId)),
    [brandId, run]
  )

  useEffectOnce(() => {
    loadTriggers()
  })

  return {
    isLoading,
    globalTriggers,
    reload: loadTriggers
  }
}
