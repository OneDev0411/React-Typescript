import { useSelector } from 'react-redux'

import { selectActiveTeamUnsafe } from '@app/selectors/team'

export function useUnsafeActiveTeam(): ReturnType<
  typeof selectActiveTeamUnsafe
> {
  const unsafeActiveTeam = useSelector(selectActiveTeamUnsafe)

  return unsafeActiveTeam
}
