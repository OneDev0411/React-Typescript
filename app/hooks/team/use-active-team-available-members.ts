import { useSelector } from 'react-redux'

import { selectActiveTeamAvailableMembers } from '@app/selectors/team'

export function useActiveTeamAvailableMembers(): ReturnType<
  typeof selectActiveTeamAvailableMembers
> {
  const members = useSelector(selectActiveTeamAvailableMembers)

  return members
}
