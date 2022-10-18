import { Typography } from '@material-ui/core'
import moment from 'moment'

interface Props {
  contact: IContact
}

export default function LastTouch({ contact }: Props) {
  const { last_touch: lastTouch } = contact

  if (!lastTouch) {
    return (
      <Typography color="textSecondary" variant="caption" component="span">
        No Touches
      </Typography>
    )
  }

  const formattedLastTouch = moment.unix(lastTouch).fromNow()

  return <Typography variant="body2">{formattedLastTouch}</Typography>
}
