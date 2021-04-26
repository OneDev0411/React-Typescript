import { Button, ButtonProps, Tooltip } from '@material-ui/core'

import useShowingDetailHasApprovalAccess from '../ShowingDetailProvider/use-showing-detail-has-approval-access'

type ShowingAppointmentApprovalButtonProps = ButtonProps

function ShowingAppointmentApprovalButton({
  disabled,
  ...otherProps
}: ShowingAppointmentApprovalButtonProps) {
  const hasApprovalAccess = useShowingDetailHasApprovalAccess()

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

export default ShowingAppointmentApprovalButton
