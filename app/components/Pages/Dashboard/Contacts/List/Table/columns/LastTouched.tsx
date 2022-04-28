import { makeStyles, Theme, Tooltip } from '@material-ui/core'
import timeago from 'timeago.js'

interface Props {
  title?: string
  contact: IContact
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    notouch: {
      fontSize: theme.typography.caption.fontSize
    },
    lastTouchLabel: {
      fontSize: theme.typography.caption.fontSize
    },
    lastTouchValue: {
      fontSize: theme.typography.subtitle2.fontSize
    }
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouched({
  contact,
  title = 'Last Touch: '
}: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch) {
    return <span className={classes.notouch}>No Touches</span>
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
          <span className={classes.lastTouchLabel}>
            {title}
            <b className={classes.lastTouchValue}>{formattedLastTouch}</b>
          </span>
        </Tooltip>
      ) : (
        <span className={classes.lastTouchLabel}>
          {title}
          <b className={classes.lastTouchValue}>{formattedLastTouch}</b>
        </span>
      )}
    </div>
  )
}
