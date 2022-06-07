import { makeStyles, Theme, Tooltip } from '@material-ui/core'
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
    lastTouchValue: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouched({ contact }: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch) {
    return <span className={classes.noTouch}>No Touches</span>
  }

  const formattedLastTouch = timeago().format(lastTouch * 1000)

  return (
    <div>
      {nextTouch ? (
        <Tooltip
          title={
            <span>
              You wanted to be in touch
              <br />
              every {Math.round((nextTouch - lastTouch) / 86400)} days.
            </span>
          }
        >
          <span className={classes.lastTouchValue}>{formattedLastTouch}</span>
        </Tooltip>
      ) : (
        <span className={classes.lastTouchValue}>{formattedLastTouch}</span>
      )}
    </div>
  )
}
