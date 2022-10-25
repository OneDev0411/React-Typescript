import { Tooltip, Typography } from '@material-ui/core'
import moment from 'moment'

interface Props {
  contact: IContact
}

export default function LastTouch({ contact }: Props) {
  const { next_touch: nextTouch, touch_freq: touchFrequency } = contact

  if (!nextTouch) {
    return (
      <Typography color="textSecondary" variant="caption" component="span">
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
          <Typography variant="body2">{formattedNextTouch}</Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2">{formattedNextTouch}</Typography>
      )}
    </div>
  )
}
