import { Typography, makeStyles, Theme } from '@material-ui/core'
import { useTitle } from 'react-use'

import { withRouter } from '@app/routes/with-router'

import { TriggerItems } from './components/Items'

const useStyles = makeStyles(
  (theme: Theme) => ({
    description: {
      marginTop: theme.spacing(1)
    }
  }),
  { name: 'GlobalTrigger' }
)

function Triggers() {
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
      <TriggerItems />
    </>
  )
}

export default withRouter(Triggers)
