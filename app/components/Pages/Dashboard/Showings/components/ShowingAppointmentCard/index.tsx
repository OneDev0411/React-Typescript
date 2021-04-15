import classNames from 'classnames'
import { Card, makeStyles } from '@material-ui/core'

import ShowingAppointmentCardImage from './ShowingAppointmentCardImage'

import ShowingAppointmentCardStatus from './ShowingAppointmentCardStatus'

const useStyles = makeStyles(
  theme => ({
    root: {
      '&:hover $address': { opacity: 1 }
    },
    address: {}
  }),
  { name: 'ShowingAppointmentCard' }
)

export interface ShowingAppointmentCardProps {
  className?: string
  hideImage?: boolean
  appointment: IShowingAppointment
}

function ShowingAppointmentCard({
  className,
  hideImage = false,
  appointment
}: ShowingAppointmentCardProps) {
  const classes = useStyles()

  return (
    <Card variant="outlined" className={classNames(classes.root, className)}>
      {!hideImage && (
        <ShowingAppointmentCardImage
          image="https://static.onecms.io/wp-content/uploads/sites/37/2016/02/15230656/white-modern-house-curved-patio-archway-c0a4a3b3.jpg"
          address="1200 Main Street Unit 2310"
          classes={{ address: classes.address }}
        />
      )}
      <ShowingAppointmentCardStatus status={appointment.status} />
      showing appointment card {appointment.status}
    </Card>
  )
}

export default ShowingAppointmentCard
