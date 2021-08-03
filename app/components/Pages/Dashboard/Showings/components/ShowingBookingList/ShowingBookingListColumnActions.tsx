import { ButtonProps, makeStyles } from '@material-ui/core'
import { mdiCheck, mdiClose } from '@mdi/js'
import classNames from 'classnames'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import useAsync from 'hooks/use-async'
import approveShowingAppointment from 'models/showing/approve-showing-appointment'
import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import { ApprovalActionParams } from '../../types'
import ShowingViewFeedbackButton, {
  ShowingViewFeedbackButtonProps
} from '../ShowingViewFeedbackButton'

import ShowingBookingListApprovalButton, {
  ShowingBookingListApprovalButtonProps
} from './ShowingBookingListApprovalButton'
import ShowingBookingListRejectMessage, {
  ShowingBookingListRejectMessageProps
} from './ShowingBookingListRejectMessage'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingBookingListColumnActions' }
)

export interface ShowingBookingListColumnActionsProps
  extends Pick<ShowingBookingListApprovalButtonProps, 'showing' | 'approvals'>,
    Pick<
      ShowingBookingListRejectMessageProps,
      'buyerName' | 'buyerMessage' | 'onAckAction' | 'appointmentId'
    >,
    ShowingViewFeedbackButtonProps {
  className?: string
  status: IShowingAppointmentStatus
  notifications: Nullable<INotification[]>
  onApprovalAction?: (params: ApprovalActionParams) => void
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
  onAckAction,
  buyerMessage,
  buyerName
}: ShowingBookingListColumnActionsProps) {
  const classes = useStyles()

  const { run, isLoading } = useAsync<IShowingAppointment | null>()

  const handleApprove = () => {
    run(async () => {
      const appointment = await approveShowingAppointment(
        showing.id,
        appointmentId
      )

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        appointment
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

      onApprovalAction?.({
        showingId: showing.id,
        appointmentId,
        appointment
      })

      return appointment
    })
  }

  const sharedButtonProps: Partial<Omit<ButtonProps, 'color'>> = {
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
          notifications={notifications}
          onAckAction={onAckAction}
          showingId={showing.id}
          appointmentId={appointmentId}
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
            color="red"
            startIcon={<SvgIcon path={mdiClose} size={muiIconSizes.small} />}
          />
          <ShowingBookingListApprovalButton
            {...sharedButtonProps}
            showing={showing}
            onClick={handleApprove}
            disabled={isLoading}
            approvals={approvals}
            label="Approve"
            color="green"
            startIcon={<SvgIcon path={mdiCheck} size={muiIconSizes.small} />}
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
