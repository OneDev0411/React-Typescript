import classNames from 'classnames'
import { Button, ButtonProps, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import approveShowingAppointment from 'models/showing/approve-showing-appointment'

import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import ShowingBookingListApprovalButton from './ShowingBookingListApprovalButton'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingBookingListColumnActions' }
)

export interface ShowingBookingListColumnActionsProps {
  className?: string
  showing: IShowing
  appointmentId: UUID
  status: IAppointmentStatus
  hasFeedback: boolean
  onApprovalAction?: (
    appointmentId: UUID,
    status: IAppointmentStatus,
    showingId: UUID
  ) => void
}

function ShowingBookingListColumnActions({
  className,
  status,
  hasFeedback,
  showing,
  appointmentId,
  onApprovalAction
}: ShowingBookingListColumnActionsProps) {
  const classes = useStyles()

  const { run, isLoading } = useAsync<IShowingAppointment>()

  const handleApprove = () => {
    run(async () => {
      const appointment = await approveShowingAppointment(
        showing.id,
        appointmentId
      )

      onApprovalAction?.(appointmentId, appointment.status, showing.id)

      return appointment
    })
  }

  const handleReject = () => {
    run(async () => {
      const appointment = await rejectShowingAppointment(
        showing.id,
        appointmentId
      )

      onApprovalAction?.(appointmentId, appointment.status, showing.id)

      return appointment
    })
  }

  const sharedButtonProps: Partial<ButtonProps> = {
    className: classes.button,
    size: 'small',
    variant: 'outlined'
  }

  return (
    <div className={classNames(classes.root, className)}>
      {(status === 'Requested' || status === 'Rescheduled') && (
        <>
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleApprove}
            disabled={isLoading}
          >
            Approve
          </ShowingBookingListApprovalButton>
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleReject}
            disabled={isLoading}
          >
            Reject
          </ShowingBookingListApprovalButton>
        </>
      )}
      {status === 'Confirmed' && (
        <ShowingBookingListApprovalButton
          {...sharedButtonProps}
          showing={showing}
          onClick={handleReject}
          disabled={isLoading}
        >
          Cancel
        </ShowingBookingListApprovalButton>
      )}
      {status === 'Completed' && hasFeedback && (
        <Button {...sharedButtonProps}>View Feedback</Button>
      )}
    </div>
  )
}

export default ShowingBookingListColumnActions
