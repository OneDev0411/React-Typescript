import { ReactNode } from 'react'
import classNames from 'classnames'
import { Card, Typography, makeStyles, Badge } from '@material-ui/core'

import { AppointmentFilter } from './types'

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
      '& > svg': { fontSize: theme.spacing(2) }
    }
  }),
  { name: 'ShowingDetailTabBookingsFilterCard' }
)

export interface BookingFilterType {
  type: AppointmentFilter
  label: string
  count: number
  badge: number
  icon: ReactNode
}

interface ShowingDetailTabBookingsFilterCardProps extends BookingFilterType {
  selected: boolean
  onClick: () => void
}

function ShowingDetailTabBookingsFilterCard({
  count,
  icon,
  label,
  onClick,
  selected,
  badge // TODO: use this as badge content
}: ShowingDetailTabBookingsFilterCardProps) {
  const classes = useStyles()

  return (
    <Badge className={classes.root} badgeContent={count} color="error">
      <Card
        className={classNames(classes.card, selected && classes.selected)}
        variant="outlined"
        onClick={onClick}
      >
        <Typography variant="subtitle1">{count}</Typography>
        <Typography variant="body2">
          <span className={classes.icon}>{icon}</span> {label}
        </Typography>
      </Card>
    </Badge>
  )
}

export default ShowingDetailTabBookingsFilterCard
