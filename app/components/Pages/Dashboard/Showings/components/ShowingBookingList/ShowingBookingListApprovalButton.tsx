import { useState } from 'react'
import { Button, ButtonProps, Tooltip } from '@material-ui/core'

import useShowingHasApprovalAccess from '../../hooks/use-showing-has-approval-access'
import ShowingAppointmentRejectFormDialog from './ShowingAppointmentRejectFormDialog'
import useAppointmentApprovalAccessMessage from './use-appointment-approval-access-message'
import useShowingHasAppointmentApproved from './use-showing-has-appointment-approved'

export interface ShowingBookingListApprovalButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'> {
  showing: IShowing
  approvals?: Nullable<IShowingApproval[]>
  label: string
  onClick: (reason?: string) => void
  hasConfirmation?: boolean
  confirmationAction?: string
}

function ShowingBookingListApprovalButton({
  disabled,
  showing,
  approvals,
  onClick,
  label,
  hasConfirmation = false,
  confirmationAction,
  ...otherProps
}: ShowingBookingListApprovalButtonProps) {
  const hasApprovalAccess = useShowingHasApprovalAccess(showing.roles)
  const hasApproved = useShowingHasAppointmentApproved(approvals)
  const message = useAppointmentApprovalAccessMessage(
    showing.roles,
    hasApproved
  )

  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)

  const closeDialog = () => setIsOpen(false)

  const handleClick = () => {
    if (hasConfirmation) {
      openDialog()
    } else {
      onClick?.()
    }
  }

  return (
    <>
      <Tooltip title={message} open={!hasApprovalAccess ? undefined : false}>
        <span>
          <Button
            {...otherProps}
            onClick={handleClick}
            disabled={disabled || !hasApprovalAccess || hasApproved}
          >
            {label}
          </Button>
        </span>
      </Tooltip>
      <ShowingAppointmentRejectFormDialog
        open={isOpen}
        onClose={closeDialog}
        onConfirm={onClick}
        subject={label}
        confirmLabel={confirmationAction}
      />
    </>
  )
}

export default ShowingBookingListApprovalButton
