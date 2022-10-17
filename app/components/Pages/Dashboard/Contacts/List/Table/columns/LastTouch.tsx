import { makeStyles, Theme } from '@material-ui/core'
import timeago from 'timeago.js'

interface Props {
  contact: IContact
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    noTouch: {
      color: theme.palette.grey[700],
      ...theme.typography.caption
    },
    lastTouch: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouch({ contact }: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch } = contact

  if (!lastTouch) {
    return <span className={classes.noTouch}>No Touches</span>
  }

  const formattedLastTouch = timeago().format(lastTouch * 1000)

  return <div className={classes.lastTouch}>{formattedLastTouch}</div>
}
