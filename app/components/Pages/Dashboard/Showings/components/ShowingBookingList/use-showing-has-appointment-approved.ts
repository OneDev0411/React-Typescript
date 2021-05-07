import { useSelector } from 'react-redux'

import { selectUserId } from 'selectors/user'

function useShowingHasAppointmentApproved(
  approvals?: Nullable<IShowingApproval[]>
): boolean {
  const userId = useSelector(selectUserId)

  return !!approvals?.some(
    approval => (approval.role as IShowingRole).user_id === userId
  )
}

export default useShowingHasAppointmentApproved
