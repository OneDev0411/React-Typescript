import classNames from 'classnames'
import { Button, ButtonProps, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'

import approveShowingAppointment from 'models/showing/approve-showing-appointment'

import rejectShowingAppointment from 'models/showing/reject-showing-appointment'

import {
  useShowingDetailId,
  useShowingDetailSetData
} from '../ShowingDetailProvider'
import ShowingAppointmentApprovalButton from './ShowingAppointmentApprovalButton'

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
  const showingId = useShowingDetailId()
  const showingSetData = useShowingDetailSetData()

  const { run, isLoading } = useAsync<IShowingAppointment>()

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

  const handleApprove = () => {
    run(async () => approveShowingAppointment(showingId, appointmentId)).then(
      appointment => {
        updateAppointmentStatus(appointment.status)
      }
    )
  }

  const handleReject = () => {
    run(async () => rejectShowingAppointment(showingId, appointmentId)).then(
      appointment => {
        updateAppointmentStatus(appointment.status)
      }
    )
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
          <ShowingAppointmentApprovalButton
            {...sharedButtonProps}
            onClick={handleApprove}
            disabled={isLoading}
          >
            Approve
          </ShowingAppointmentApprovalButton>
          <ShowingAppointmentApprovalButton
            {...sharedButtonProps}
            onClick={handleReject}
            disabled={isLoading}
          >
            Reject
          </ShowingAppointmentApprovalButton>
        </>
      )}
      {status === 'Confirmed' && (
        <ShowingAppointmentApprovalButton
          {...sharedButtonProps}
          onClick={handleReject}
          disabled={isLoading}
        >
          Cancel
        </ShowingAppointmentApprovalButton>
      )}
      {status === 'Completed' && hasFeedback && (
        <Button {...sharedButtonProps}>View Feedback</Button>
      )}
    </div>
  )
}

export default ShowingDetailTabBookingsListColumnActions
