import { useSelector } from 'react-redux'

import { selectUserId } from 'selectors/user'

function useCheckApprovalAccess(roles?: IShowingRole[]): boolean {
  const userId = useSelector(selectUserId)

  return !!roles?.some(role => role.user_id === userId)
}

export default useCheckApprovalAccess
