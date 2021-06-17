import classNames from 'classnames'
import { ButtonProps, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import approveShowingAppointment from 'models/showing/approve-showing-appointment'

import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import { ackNotifications } from 'models/notifications'

import ShowingBookingListApprovalButton, {
  ShowingBookingListApprovalButtonProps
} from './ShowingBookingListApprovalButton'
import { ApprovalActionParams, DismissActionParams } from '../../types'
import ShowingBookingListRejectMessage, {
  ShowingBookingListRejectMessageProps
} from './ShowingBookingListRejectMessage'
import ShowingViewFeedbackButton, {
  ShowingViewFeedbackButtonProps
} from '../ShowingViewFeedbackButton'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingBookingListColumnActions' }
)

export interface ShowingBookingListColumnActionsProps
  extends Pick<ShowingBookingListApprovalButtonProps, 'showing' | 'approvals'>,
    Pick<ShowingBookingListRejectMessageProps, 'buyerName' | 'buyerMessage'>,
    ShowingViewFeedbackButtonProps {
  className?: string
  appointmentId: UUID
  status: IShowingAppointmentStatus
  notifications: Nullable<INotification[]>
  onApprovalAction?: (params: ApprovalActionParams) => void
  onDismissAction?: (params: DismissActionParams) => void
}

function ShowingBookingListColumnActions({
  className,
  status,
  contact,
  feedback,
  appointmentTitle,
  showing,
  appointmentId,
  onApprovalAction,
  approvals,
  notifications,
  onDismissAction,
  buyerMessage,
  buyerName
}: ShowingBookingListColumnActionsProps) {
  const classes = useStyles()

  const { run, isLoading } = useAsync<IShowingAppointment | null>()

  const handleApprove = () => {
    run(async () => {
      await ackNotifications(
        notifications?.map(notification => notification.id)
      )

      const appointment = await approveShowingAppointment(
        showing.id,
        appointmentId
      )

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        appointment,
        notificationCount: notifications?.length ?? 0
      })

      return appointment
    })
  }

  const handleReject = (comment?: string) => {
    run(async () => {
      await ackNotifications(
        notifications?.map(notification => notification.id)
      )

      const appointment = await rejectShowingAppointment(
        showing.id,
        appointmentId,
        comment
      )

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        appointment,
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
      {(status === 'Rescheduled' || status === 'Canceled') && (
        <ShowingBookingListRejectMessage
          approvals={approvals}
          buyerName={buyerName}
          buyerMessage={buyerMessage}
          appointmentTitle={appointmentTitle}
        />
      )}
      {(status === 'Requested' || status === 'Rescheduled') && (
        <>
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleReject}
            disabled={isLoading}
            label="Reject"
            hasConfirmation
          />
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleApprove}
            disabled={isLoading}
            approvals={approvals}
            label="Approve"
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
      {!!notifications?.length && status === 'Canceled' && (
        <ShowingBookingListApprovalButton
          {...sharedButtonProps}
          showing={showing}
          onClick={handleDismiss}
          disabled={isLoading}
          label="Dismiss"
        />
      )}
      {feedback && (
        <ShowingViewFeedbackButton
          {...sharedButtonProps}
          contact={contact}
          feedback={feedback}
          appointmentTitle={appointmentTitle}
        />
      )}
    </div>
  )
}

export default ShowingBookingListColumnActions
