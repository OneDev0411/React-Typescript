import { useSelector } from 'react-redux'

import { selectActiveTeamBrands } from '@app/selectors/team'

export function useActiveTeamBrands(): ReturnType<
  typeof selectActiveTeamBrands
> {
  const activeTeam = useSelector(selectActiveTeamBrands)

  return activeTeam
}
