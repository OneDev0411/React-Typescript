import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { IGlobalTriggerState } from '@app/reducers/global-triggers'
import { selectActiveBrandId } from '@app/selectors/brand'
import { selectGlobalTriggers } from '@app/selectors/globalTriggers'
import { fetchGlobalTriggers } from '@app/store_actions/global-triggers'

export interface UseGetGlobalTriggers extends IGlobalTriggerState {
  isEmpty: boolean
}

export function useGetGlobalTriggers(): UseGetGlobalTriggers {
  const dispatch = useDispatch()
  const brandId = useSelector(selectActiveBrandId)
  const { isLoading, attrs }: IGlobalTriggerState =
    useSelector(selectGlobalTriggers)

  useEffectOnce(() => {
    dispatch(fetchGlobalTriggers(brandId))
  })

  return {
    isEmpty: isEmpty(attrs),
    isLoading,
    attrs
  }
}
