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

  return (
    <div className={classes.root}>
      <>
        {item.isToday && <div>Today</div>}
        {item.isTomorrow && <div>Tomorrow</div>}
      </>

      <div>{fecha.format(new Date(item.date), 'D MMM, ddd')}</div>
    </div>
  )
}
