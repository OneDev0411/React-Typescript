import { Typography, Theme, Box, Button } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

import { OAuthProvider } from 'constants/contacts'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

const useStyles = makeStyles(
  (theme: Theme) => ({
    wrapper: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '80%',
      maxWidth: '900px'
    },
    main: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row'
    },
    image: {
      flexBasis: '50%'
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexBasis: '50%'
    },
    extra: {
      flexGrow: 1
    }
  }),
  { name: 'InboxZeroState' }
)

export default function InboxZeroState() {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.container}>
        <Box className={classes.main}>
          <Box className={classes.image}>
            <img
              src="/static/images/zero-state/inbox.jpg"
              alt="inbox"
              width="400"
            />
          </Box>
          <Box className={classes.message}>
            <Box>
              <Typography variant="h4">See your emails here!</Typography>
              <Typography variant="body1">
                Connect your Google or Outlook account and see your emails here.
                Rechat helps you to be on top of your customers
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                paddingY={theme.spacing(1)}
              >
                <Button
                  disabled={google.connecting}
                  onClick={google.connect}
                  variant="outlined"
                  size="large"
                  data-tour-id="gmail-import"
                  startIcon={<IconGoogle />}
                >
                  Sign in with Google
                </Button>

                <Button
                  disabled={outlook.connecting}
                  onClick={outlook.connect}
                  variant="outlined"
                  size="large"
                  data-tour-id="outlook-import"
                  startIcon={<IconOutlook />}
                >
                  Sign in with Outlook
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.extra} />
      </Box>
    </Box>
  )
}
