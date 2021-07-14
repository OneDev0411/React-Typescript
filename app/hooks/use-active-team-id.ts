import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'
import { getActiveTeamId } from '@app/utils/user-teams'

export function useActiveTeamId(): UUID {
  const user = useSelector(selectUser)

  return getActiveTeamId(user)!
}
