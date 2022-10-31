import { Link, makeStyles, Theme, Typography } from '@material-ui/core'
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
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'none',
        color: theme.palette.grey[600],
        background: theme.palette.action.hover
      }
    },
    value: {
      color: theme.palette.grey[900],
      textAlign: 'right'
    },
    videoModeActionBar: {
      position: 'absolute',
      top: '90%',
      right: '0',
      display: 'flex',
      zIndex: 1,
      visibility: 'visible'
    },
    videoModeActionBarActive: {
      visibility: 'visible'
    },
    action: {
      padding: theme.spacing(0, 2),
      background: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      color: theme.palette.grey[800],
      '& svg': {
        color: theme.palette.grey[800],
        margin: 'auto'
      },
      '&:hover': {
        background: theme.palette.action.hover,
        textDecoration: 'none'
      }
    },
    actionLabel: {
      display: 'block',
      color: theme.palette.grey[800],
      ...theme.typography.caption
    },
    actionContainer: {
      display: 'flex',
      alignItems: 'center',
      background: theme.palette.background.paper,
      padding: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[4]
    },
    actionsWrapper: {
      width: '200px',
      display: 'flex',
      flexDirection: 'column'
    }
  }),
  { name: 'LatTouchField' }
)

interface Props {
  value?: number
}

const LastTouchField = ({ value }: Props) => {
  const classes = useStyles()
  let lastTouchTime

  if (value) {
    lastTouchTime = timeago().format(value * 1000)
  }

  return (
    <Link className={classes.container} target="_blank">
      <Typography variant="body2">Last Touch</Typography>
      <Typography variant="body2" className={classes.value}>
        {lastTouchTime}
      </Typography>
    </Link>
  )
}

export default LastTouchField
