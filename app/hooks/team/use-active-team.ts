import { useSelector } from 'react-redux'

import { selectActiveTeam } from '@app/selectors/team'

export function useActiveTeam(): ReturnType<typeof selectActiveTeam> {
  const activeTeam = useSelector(selectActiveTeam)

  return activeTeam
}
