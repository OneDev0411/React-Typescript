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
    NextTouch: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouch({ contact }: Props) {
  const classes = useStyles()
  const { next_touch: nextTouch, touch_freq: touchFrequency } = contact

  if (!nextTouch) {
    return <span className={classes.noTouch}>No Touches</span>
  }

  const formattedNextTouch = timeago().format(nextTouch * 1000)

  return (
    <div>
      {touchFrequency ? (
        <Tooltip
          title={
            <span>
              You wanted to be in touch
              <br />
              every {touchFrequency} days.
            </span>
          }
        >
          <span className={classes.NextTouch}>{formattedNextTouch}</span>
        </Tooltip>
      ) : (
        <span className={classes.NextTouch}>{formattedNextTouch}</span>
      )}
    </div>
  )
}
