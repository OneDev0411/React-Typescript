import classNames from 'classnames'
import { Card, Typography, makeStyles, Badge } from '@material-ui/core'

import { Link } from 'react-router'

import { AppointmentFilter, AppointmentFilterInfo } from '../../types'

const useStyles = makeStyles(
  theme => ({
    root: { width: '100%' },
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: theme.spacing(8),
      cursor: 'pointer',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'color'
      ])
    },
    selected: {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.success.ultralight,
      color: theme.palette.primary.dark
    },
    icon: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      marginRight: theme.spacing(0.5),
      '& > svg': { fontSize: theme.spacing(2) }
    }
  }),
  { name: 'ShowingAppointmentFilterCard' }
)

export interface BookingFilterType extends AppointmentFilterInfo {
  type: AppointmentFilter
  count: number
  badge: number
}

interface ShowingAppointmentFilterCardProps extends BookingFilterType {
  selected: boolean
  onClick: () => void
  link?: string
}

function ShowingAppointmentFilterCard({
  count,
  icon,
  label,
  onClick,
  selected,
  badge,
  link
}: ShowingAppointmentFilterCardProps) {
  const classes = useStyles()

  const card = (
    <Badge className={classes.root} badgeContent={badge} color="error">
      <Card
        className={classNames(classes.card, selected && classes.selected)}
        variant="outlined"
        onClick={onClick}
      >
        <Typography variant="subtitle1">{count}</Typography>
        <Typography variant="body2">
          {icon && <span className={classes.icon}>{icon}</span>}
          {label}
        </Typography>
      </Card>
    </Badge>
  )

  return link ? <Link to={link}>{card}</Link> : card
}

export default ShowingAppointmentFilterCard
