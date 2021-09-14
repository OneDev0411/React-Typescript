import { Typography, Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    badge: {
      marginLeft: theme.spacing(2),
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: '50%',
      backgroundColor: theme.palette.secondary.main
    },
    text: {
      paddingLeft: theme.spacing(3)
    },
    title: {
      marginBottom: theme.spacing(0.5)
    }
  }),
  { name: 'NotificationMessage' }
)

interface Props {
  isSeen: boolean
  title: string
  message: string
  onClick: () => void
}

export default function Message({ isSeen, title, message, onClick }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container} onClick={onClick}>
      {!isSeen && <div className={classes.badge} />}
      <div className={classes.text}>
        <Typography
          variant="body2"
          color="textPrimary"
          className={classes.title}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </div>
    </div>
  )
}
