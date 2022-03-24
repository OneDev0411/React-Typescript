import { Box, Button } from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'

import { OAuthProvider } from '@app/constants/contacts'
import { useConnectOAuthAccount } from '@app/hooks/use-connect-oauth-account'
import useNotify from '@app/hooks/use-notify'
import GoogleIcon from '@app/views/components/SvgIcons/Google/IconGoogle'
import { iconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import OutlookIcon from '@app/views/components/SvgIcons/Outlook/IconOutlook'

import { EmptyState } from '../../components/EmptyState'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      paddingTop: theme.spacing(3)
    },
    listIcon: { marginRight: theme.spacing(2) }
  }),
  { name: 'ThisWeeksScheduleEmptyState' }
)

export function ThisWeeksScheduleEmptyState() {
  const classes = useStyles()
  const notify = useNotify()

  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const handleGoogleConnect = () => {
    if (google.connecting) {
      return notify({
        message: `a sync process has already been requested,
 please wait till getting finishes.`,
        status: 'info'
      })
    }

    google.connect()
  }

  return (
    <EmptyState
      description="Connect one or more of your accounts to have your email, contacts, and calendar(s) synced in both directions."
      iconSrc="/static/icons/empty-states/letter.svg"
      moreLinkLabel="Learn More"
      moreLinkUrl="https://help.rechat.com/guides/crm/connect-to-outlook-google"
      title="Connect Your Google / Outlook"
    >
      <Box className={classes.container}>
        <Box mr={1} mb={1}>
          <Button
            variant="outlined"
            disabled={google.connecting}
            onClick={() => {
              handleGoogleConnect()
            }}
          >
            <GoogleIcon size={iconSizes.medium} className={classes.listIcon} />
            Connect Your Google
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            disabled={outlook.connecting}
            onClick={() => {
              outlook.connect()
            }}
          >
            <OutlookIcon size={iconSizes.medium} className={classes.listIcon} />
            Connect Your Outlook
          </Button>
        </Box>
      </Box>
    </EmptyState>
  )
}

export default ThisWeeksScheduleEmptyState
