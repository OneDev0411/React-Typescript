import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { selectActiveTeamUnsafe } from '@app/selectors/team'
import { fetchActiveTeam } from '@app/store_actions/active-team'

export function useLoadActiveTeam() {
  const dispatch = useDispatch()
  const activeTeam = useSelector(selectActiveTeamUnsafe)

  useEffectOnce(() => {
    if (activeTeam) {
      return
    }

    dispatch(fetchActiveTeam())
  })
}
