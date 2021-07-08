import { useCallback } from 'react'

import useAsync from '@app/hooks/use-async'
import model from '@app/models/Deal'

export interface UseDealsGetClosings {
  isLoading: boolean
  deals: IDeal[]
  load: () => void
  reset: () => void
}

function useDealsGetClosings(): UseDealsGetClosings {
  const { isLoading, data: deals, run, reset } = useAsync<IDeal[]>({
    status: 'pending',
    data: []
  })

  const load = useCallback(() => {
    run(model.getClosings)
  }, [run])

  return {
    isLoading,
    deals,
    load,
    reset
  }
}

export default useDealsGetClosings
