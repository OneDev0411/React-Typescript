import { useSelector } from 'react-redux'

import { selectUserId } from 'selectors/user'

function useShowingHasApprovalAccess(roles?: IShowingRole[]): boolean {
  const userId = useSelector(selectUserId)

  return !!roles?.some(role => role.user_id === userId && role.can_approve)
}

export default useShowingHasApprovalAccess
