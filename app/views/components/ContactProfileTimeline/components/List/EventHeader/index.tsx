import { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core/styles'
import fecha from 'fecha'

interface Props {
  item: ICalendarEventHeader
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ isToday, isPast }: { isToday: boolean; isPast: boolean }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    letterSpacing: '0.4px',
    minHeight: theme.spacing(8),
    textTransform: 'uppercase',
    color: isToday
      ? theme.palette.secondary.main
      : isPast
      ? theme.palette.grey['500']
      : theme.palette.grey['900'],
    ...theme.typography.caption
  })
}))

/**
 * renders the day header
 * @param props
 */
export function EventHeader({ item }: Props) {
  const today = new Date()
  const date = useMemo(() => new Date(item.date), [item.date])
  const isCurrentYear = useMemo(
    () => fecha.format(date, 'YYYY') === fecha.format(new Date(), 'YYYY'),
    [date]
  )

  //----

  const classes = useStyles({
    isToday: item.isToday,
    isPast: date < today
  })

  return (
    <div className={classes.root}>
      {item.isToday && <div>Today</div>}
      {item.isTomorrow && <div>Tomorrow</div>}

      <div>
        {isCurrentYear
          ? fecha.format(date, 'D MMM, ddd')
          : fecha.format(date, 'D MMM YYYY')}
      </div>
    </div>
  )
}
