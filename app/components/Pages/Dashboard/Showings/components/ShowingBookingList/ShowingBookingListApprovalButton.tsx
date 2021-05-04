import { useSelector } from 'react-redux'
import { Button, ButtonProps, Tooltip } from '@material-ui/core'

import { selectUserId } from 'selectors/user'

import useShowingHasApprovalAccess from '../../hooks/use-showing-has-approval-access'

export interface ShowingBookingListApprovalButtonProps extends ButtonProps {
  showing: IShowing
  approvals?: Nullable<IShowingApproval[]>
}

function ShowingBookingListApprovalButton({
  disabled,
  showing,
  approvals,
  ...otherProps
}: ShowingBookingListApprovalButtonProps) {
  const hasApprovalAccess = useShowingHasApprovalAccess(showing.roles)
  const userId = useSelector(selectUserId)
  const hasApproved = !!approvals?.some(
    approval => (approval.role as IShowingRole).user_id === userId
  )

  return (
    <Tooltip
      title={
        hasApproved
          ? 'Waiting for other roles to approve this'
          : 'You do not have access to this action'
      }
      open={!hasApprovalAccess ? undefined : false}
    >
      <span>
        <Button
          {...otherProps}
          disabled={disabled || !hasApprovalAccess || hasApproved}
        />
      </span>
    </Tooltip>
  )
}

export default ShowingBookingListApprovalButton
