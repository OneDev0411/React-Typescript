import { useState } from 'react'

import {
  Button,
  ButtonProps,
  Tooltip,
  makeStyles,
  PropTypes
} from '@material-ui/core'
import classNames from 'classnames'

import useShowingHasApprovalAccess from '../../hooks/use-showing-has-approval-access'

import ShowingAppointmentRejectFormDialog from './ShowingAppointmentRejectFormDialog'
import useAppointmentApprovalAccessMessage from './use-appointment-approval-access-message'
import useShowingHasAppointmentApproved from './use-showing-has-appointment-approved'

const useStyles = makeStyles(
  theme => ({
    red: { color: theme.palette.error.main },
    green: { color: theme.palette.primary.main },
    wrapper: { display: 'inline-block' }
  }),
  { name: 'ShowingBookingListApprovalButton' }
)

export interface ShowingBookingListApprovalButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children' | 'color'> {
  showing: IShowing
  approvals?: Nullable<IShowingApproval<'role'>[]>
  label: string
  onClick: (reason?: string) => void
  hasConfirmation?: boolean
  confirmationAction?: string
  color?: 'red' | 'green' | PropTypes.Color
}

function ShowingBookingListApprovalButton({
  disabled,
  showing,
  approvals,
  onClick,
  label,
  hasConfirmation = false,
  confirmationAction,
  color,
  className,
  ...otherProps
}: ShowingBookingListApprovalButtonProps) {
  const classes = useStyles()
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
        <span className={classes.wrapper}>
          <Button
            {...otherProps}
            className={classNames(color && classes[color], className)}
            color={
              color && !!classes[color] ? 'inherit' : (color as PropTypes.Color)
            }
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
