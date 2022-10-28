import { useMemo } from 'react'

import { Typography } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import fecha from 'fecha'

interface Props {
  item: ICalendarEventHeader
}

const useStyles = makeStyles((theme: Theme) => ({
  root: () => ({
    whiteSpace: 'nowrap',
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
  })
}))

/**
 * renders the day header
 * @param props
 */
export function EventHeader({ item }: Props) {
  const date = useMemo(() => new Date(item.date), [item.date])

  //----

  const classes = useStyles()

  return (
    <Typography className={classes.root} variant="h6">
      {item.isToday && 'TODAY - '}
      {item.isToday
        ? fecha.format(date, 'MMM D, YY')
        : fecha.format(date, 'ddd - MMM D, YY')}
    </Typography>
  )
}
