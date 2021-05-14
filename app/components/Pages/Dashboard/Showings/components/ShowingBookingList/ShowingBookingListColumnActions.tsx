import classNames from 'classnames'
import { Button, ButtonProps, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import approveShowingAppointment from 'models/showing/approve-showing-appointment'

import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import { ackNotifications } from 'models/notifications'

import ShowingBookingListApprovalButton, {
  ShowingBookingListApprovalButtonProps
} from './ShowingBookingListApprovalButton'
import { ApprovalActionParams, DismissActionParams } from '../../types'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingBookingListColumnActions' }
)

export interface ShowingBookingListColumnActionsProps
  extends Pick<ShowingBookingListApprovalButtonProps, 'showing' | 'approvals'> {
  className?: string
  appointmentId: UUID
  status: IShowingAppointmentStatus
  hasFeedback: boolean
  notifications: Nullable<INotification[]>
  notificationMode?: boolean
  onApprovalAction?: (params: ApprovalActionParams) => void
  onDismissAction?: (params: DismissActionParams) => void
}

function ShowingBookingListColumnActions({
  className,
  status,
  hasFeedback,
  showing,
  appointmentId,
  onApprovalAction,
  approvals,
  notifications,
  notificationMode,
  onDismissAction
}: ShowingBookingListColumnActionsProps) {
  const classes = useStyles()

  const { run, isLoading } = useAsync<IShowingAppointment | null>()

  const handleApprove = () => {
    run(async () => {
      const appointment = await approveShowingAppointment(
        showing.id,
        appointmentId
      )

      await ackNotifications(
        notifications?.map(notification => notification.id)
      )

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        status: appointment.status,
        notificationCount: notifications?.length ?? 0
      })

      return appointment
    })
  }

  const handleReject = (comment?: string) => {
    run(async () => {
      const appointment = await rejectShowingAppointment(
        showing.id,
        appointmentId,
        comment
      )

      await ackNotifications(
        notifications?.map(notification => notification.id)
      )

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        status: appointment.status,
        notificationCount: notifications?.length ?? 0
      })

      return appointment
    })
  }

  const handleDismiss = async () => {
    run(async () => {
      await ackNotifications(
        notifications?.map(notification => notification.id)
      )

      await onDismissAction?.({
        showingId: showing.id,
        appointmentId,
        notificationCount: notifications?.length ?? 0
      })

      return null
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
            approvals={approvals}
            label="Approve"
          />
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleReject}
            disabled={isLoading}
            label="Reject"
            hasConfirmation
          />
        </>
      )}
      {status === 'Confirmed' && (
        <ShowingBookingListApprovalButton
          {...sharedButtonProps}
          showing={showing}
          onClick={handleReject}
          disabled={isLoading}
          label="Cancel"
          hasConfirmation
          confirmationAction="Cancel booking"
        />
      )}
      {notificationMode && status === 'Canceled' && (
        <ShowingBookingListApprovalButton
          {...sharedButtonProps}
          showing={showing}
          onClick={handleDismiss}
          disabled={isLoading}
          label="Dismiss"
        />
      )}
      {status === 'Completed' && hasFeedback && (
        <Button {...sharedButtonProps}>View Feedback</Button>
      )}
    </div>
  )
}

export default ShowingBookingListColumnActions
