import classNames from 'classnames'
import { Box, Button, Card, makeStyles } from '@material-ui/core'

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
  hideStatus?: boolean
  appointment: IShowingAppointment
  onStatusChange?: () => void
}

function ShowingAppointmentCard({
  className,
  hideImage = false,
  hideStatus = false,
  appointment,
  onStatusChange
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
      {!hideStatus && (
        <ShowingAppointmentCardStatus status={appointment.status} />
      )}
      showing appointment card {appointment.status}
      <Box my={1.5} mx={1}>
        <Button size="small" variant="outlined" onClick={onStatusChange}>
          Action
        </Button>
      </Box>
    </Card>
  )
}

export default ShowingAppointmentCard
