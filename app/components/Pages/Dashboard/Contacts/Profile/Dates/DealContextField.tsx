import { useMemo } from 'react'

import { Link, Typography, Tooltip, Theme, makeStyles } from '@material-ui/core'
import fecha from 'fecha'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      padding: theme.spacing(0.5, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.grey[600],
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.secondary.main,
        background: theme.palette.action.hover
      }
    },
    value: {
      color: theme.palette.grey[900],
      textAlign: 'right'
    }
  }),
  { name: 'DealContextField' }
)

interface Props {
  deal: UUID
  title: string
  value: number
  isAllDay: boolean
}

export default function DealContextField({
  title,
  value,
  deal,
  isAllDay
}: Props) {
  const classes = useStyles()

  const dealDate = useMemo(() => {
    const date = new Date(value * 1000)

    if (isAllDay) {
      date.setFullYear(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      )
    }

    return date
  }, [isAllDay, value])

  return (
    <Tooltip title="Home Anniversary">
      <Link
        className={classes.container}
        href={`/dashboard/deals/${deal}`}
        target="_blank"
      >
        <Typography variant="body2">{title}</Typography>
        <Typography variant="body2" className={classes.value}>
          {fecha.format(dealDate, 'MMM DD, YYYY')}
        </Typography>
      </Link>
    </Tooltip>
  )
}
