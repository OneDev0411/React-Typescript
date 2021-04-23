import classNames from 'classnames'
import { Button, ButtonProps, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'

// import approveShowingAppointment from 'models/showing/approve-showing-appointment'

// import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import {
  useShowingDetailId,
  useShowingDetailSetData
} from '../ShowingDetailProvider'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingDetailTabBookingsListColumnActions' }
)

interface ShowingDetailTabBookingsListColumnActionsProps {
  className?: string
  appointmentId: UUID
  status: IAppointmentStatus
  hasFeedback: boolean
}

function ShowingDetailTabBookingsListColumnActions({
  className,
  status,
  hasFeedback,
  appointmentId
}: ShowingDetailTabBookingsListColumnActionsProps) {
  const classes = useStyles()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showingId = useShowingDetailId()
  const showingSetData = useShowingDetailSetData()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { run, isLoading } = useAsync()

  const updateAppointmentStatus = (status: IAppointmentStatus) => {
    showingSetData(showing => {
      const appointments = [...showing.appointments]

      const appointmentIndex = appointments.findIndex(
        appointment => appointment.id === appointmentId
      )

      if (appointmentIndex === -1) {
        return showing
      }

      appointments.splice(appointmentIndex, 1, {
        ...appointments[appointmentIndex],
        status
      })

      return { ...showing, appointments }
    })
  }

  // TODO: call the real APIs here
  const handleApprove = () => {
    // console.log('handleApprove')
    updateAppointmentStatus('Confirmed')
    // run(async () => approveShowingAppointment(showingId, appointmentId)).then(
    //   res => {
    //     console.log('approveShowingAppointment::response', res)
    //   }
    // )
  }

  const handleReject = () => {
    // console.log('handleReject')
    updateAppointmentStatus('Canceled')
    // run(async () => rejectShowingAppointment(showingId, appointmentId)).then(
    //   res => {
    //     console.log('rejectShowingAppointment::response', res)
    //   }
    // )
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
          <Button
            {...sharedButtonProps}
            onClick={handleApprove}
            disabled={isLoading}
          >
            Approve
          </Button>
          <Button
            {...sharedButtonProps}
            onClick={handleReject}
            disabled={isLoading}
          >
            Reject
          </Button>
        </>
      )}
      {status === 'Confirmed' && (
        <Button
          {...sharedButtonProps}
          onClick={handleReject}
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}
      {status === 'Completed' && hasFeedback && (
        <Button {...sharedButtonProps}>View Feedback</Button>
      )}
    </div>
  )
}

export default ShowingDetailTabBookingsListColumnActions
