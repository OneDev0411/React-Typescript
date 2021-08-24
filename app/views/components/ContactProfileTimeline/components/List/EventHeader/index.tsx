import { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core/styles'
import fecha from 'fecha'

interface Props {
  item: ICalendarEventHeader
}

const useStyles = makeStyles((theme: Theme) => ({
  root: ({ today }: { today: boolean }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: theme.spacing(8),
    color: today ? theme.palette.secondary.main : theme.palette.grey['900'],
    ...theme.typography.caption
  })
}))

/**
 * renders the day header
 * @param props
 */
export function EventHeader({ item }: Props) {
  const classes = useStyles({
    today: item.isToday
  })

  const date = useMemo(() => new Date(item.date), [item.date])
  const isCurrentYear = useMemo(
    () => fecha.format(date, 'YYYY') === fecha.format(new Date(), 'YYYY'),
    [date]
  )

  return (
    <div className={classes.root}>
      <>
        {item.isToday && <div>Today</div>}
        {item.isTomorrow && <div>Tomorrow</div>}
      </>

      <div>
        {isCurrentYear
          ? fecha.format(date, 'D MMM, ddd')
          : fecha.format(date, 'D MMM YYYY')}
      </div>
    </div>
  )
}
