import { Typography, Theme, makeStyles } from '@material-ui/core'
import { useTitle } from 'react-use'

const useStyles = makeStyles(
  (theme: Theme) => ({
    description: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'GlobalTrigger' }
)

interface Props {}

export default function Trigger(props: Props) {
  useTitle('Trigger | Settings | Rechat')

  const classes = useStyles()

  return (
    <>
      <Typography variant="subtitle1">
        Send Birthday and Anniversary Email Automatically
      </Typography>
      <Typography variant="body2" className={classes.description}>
        Your contacts will receive an email on their birthdays and
        anniversaries. It is possible to opt out contacts or change the template
        in their profile.
      </Typography>
    </>
  )
}
