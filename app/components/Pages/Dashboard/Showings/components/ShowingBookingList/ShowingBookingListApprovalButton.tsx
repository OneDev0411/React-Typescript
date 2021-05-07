import { Button, ButtonProps, Tooltip } from '@material-ui/core'

import useShowingHasApprovalAccess from '../../hooks/use-showing-has-approval-access'
import useAppointmentApprovalAccessMessage from './use-appointment-approval-access-message'
import useShowingHasAppointmentApproved from './use-showing-has-appointment-approved'

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
  const hasApproved = useShowingHasAppointmentApproved(approvals)
  const message = useAppointmentApprovalAccessMessage(
    showing.roles,
    hasApproved
  )

  return (
    <Tooltip title={message} open={!hasApprovalAccess ? undefined : false}>
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
