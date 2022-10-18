import { makeStyles, Theme, Tooltip, Typography } from '@material-ui/core'
import moment from 'moment'

interface Props {
  contact: IContact
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    noTouch: {
      color: theme.palette.grey[700]
    },
    nextTouch: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouch({ contact }: Props) {
  const classes = useStyles()
  const { next_touch: nextTouch, touch_freq: touchFrequency } = contact

  if (!nextTouch) {
    return (
      <Typography variant="caption" component="span">
        No Touches
      </Typography>
    )
  }

  const formattedNextTouch = moment.unix(nextTouch).fromNow()

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
          <span className={classes.nextTouch}>{formattedNextTouch}</span>
        </Tooltip>
      ) : (
        <span className={classes.nextTouch}>{formattedNextTouch}</span>
      )}
    </div>
  )
}
