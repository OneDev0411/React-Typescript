import { Button, ButtonProps, Tooltip } from '@material-ui/core'

import useShowingHasApprovalAccess from '../../hooks/use-showing-has-approval-access'

interface ShowingBookingListApprovalButtonProps extends ButtonProps {
  showing: IShowing
}

function ShowingBookingListApprovalButton({
  disabled,
  showing,
  ...otherProps
}: ShowingBookingListApprovalButtonProps) {
  const hasApprovalAccess = useShowingHasApprovalAccess(showing?.roles)

  return (
    <Tooltip
      title="You do not have access to this action"
      open={!hasApprovalAccess ? undefined : false}
    >
      <span>
        <Button {...otherProps} disabled={disabled || !hasApprovalAccess} />
      </span>
    </Tooltip>
  )
}

export default ShowingBookingListApprovalButton
