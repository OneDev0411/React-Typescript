import { useSelector } from 'react-redux'

import { IAppState } from '@app/reducers'
import { getBrandByType } from '@app/utils/user-teams'

export function useBrand() {
  return useSelector<IAppState, Nullable<IBrand>>(({ activeTeam }) =>
    getBrandByType(activeTeam, 'Brokerage')
  )
}
