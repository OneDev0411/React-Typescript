import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import timeago from 'timeago.js'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      position: 'relative',
      width: '100%',
      padding: theme.spacing(0.5, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.grey[600],
      borderRadius: theme.shape.borderRadius,
      cursor: 'default',
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.grey[600],
        background: 'none'
      }
    },
    value: {
      color: theme.palette.grey[900],
      textAlign: 'right'
    }
  }),
  { name: 'LatTouchField' }
)

interface Props {
  value?: number
}

const LastTouchField = ({ value }: Props) => {
  const classes = useStyles()
  const lastTouchTime = value ? timeago().format(value * 1000) : undefined

  return (
    <Button variant="text" className={classes.container}>
      <Typography variant="body2">Last Touch</Typography>
      <Typography variant="body2" className={classes.value}>
        {lastTouchTime}
      </Typography>
    </Button>
  )
}

export default LastTouchField
