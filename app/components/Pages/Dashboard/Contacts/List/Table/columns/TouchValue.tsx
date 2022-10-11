import { makeStyles, Theme, Tooltip } from '@material-ui/core'
import timeago from 'timeago.js'

interface Props {
  contact: IContact
  isLastTouch?: boolean
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    noTouch: {
      color: theme.palette.grey[700],
      ...theme.typography.caption
    },
    TouchValue: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function TouchValue({ contact, isLastTouch }: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch, next_touch: nextTouch } = contact

  if (!lastTouch || !nextTouch) {
    return <span className={classes.noTouch}>No Touches</span>
  }

  if (isLastTouch) {
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
            <span className={classes.TouchValue}>{formattedLastTouch}</span>
          </Tooltip>
        ) : (
          <span className={classes.TouchValue}>{formattedLastTouch}</span>
        )}
      </div>
    )
  }

  const formattedNextTouch = timeago().format(nextTouch * 1000)

  return (
    <div>
      <span className={classes.TouchValue}>{formattedNextTouch}</span>
    </div>
  )
}
