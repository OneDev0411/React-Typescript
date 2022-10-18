import { makeStyles, Theme, Typography } from '@material-ui/core'
import moment from 'moment'

interface Props {
  contact: IContact
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    noTouch: {
      color: theme.palette.grey[700]
    },
    lastTouch: theme.typography.body2
  }),
  { name: 'LastTouchedCell' }
)

export default function LastTouch({ contact }: Props) {
  const classes = useStyles()
  const { last_touch: lastTouch } = contact

  if (!lastTouch) {
    return (
      <Typography variant="caption" component="span">
        No Touches
      </Typography>
    )
  }

  const formattedLastTouch = moment.unix(lastTouch).fromNow()

  return <div className={classes.lastTouch}>{formattedLastTouch}</div>
}
