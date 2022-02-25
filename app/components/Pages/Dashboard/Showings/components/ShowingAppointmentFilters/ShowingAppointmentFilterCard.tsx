import { Badge, Card, Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Link } from 'react-router'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { AppointmentFilter, AppointmentFilterInfo } from '../../types'

const useStyles = makeStyles(
  theme => ({
    root: { width: '100%' },
    link: { '&:hover, &:focus': { textDecoration: 'none' } },
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
      ]),
      '&:hover': { backgroundColor: theme.palette.success.ultralight }
    },
    selected: {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      backgroundColor: theme.palette.success.ultralight,
      color: theme.palette.primary.dark
    },
    icon: {
      display: 'inline-flex',
      verticalAlign: 'middle',
      marginRight: theme.spacing(0.5)
    },
    info: {
      display: 'flex',
      alignItems: 'baseline',
      marginTop: theme.spacing(0.25)
    },
    label: { marginLeft: theme.spacing(0.5) }
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
        {icon ? (
          <SvgIcon path={icon} />
        ) : (
          <Typography variant="subtitle1">{count}</Typography>
        )}
        <div className={classes.info}>
          {icon && <Typography variant="subtitle1">{count}</Typography>}
          <Typography className={classes.label} variant="body2">
            {label}
          </Typography>
        </div>
      </Card>
    </Badge>
  )

  return link ? (
    <Link className={classes.link} to={link}>
      {card}
    </Link>
  ) : (
    card
  )
}

export default ShowingAppointmentFilterCard
