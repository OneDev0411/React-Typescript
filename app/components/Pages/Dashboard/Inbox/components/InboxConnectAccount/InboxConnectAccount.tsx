import React from 'react'
import { Typography, Theme, Box, Button } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

import { OAuthProvider } from 'constants/contacts'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import importEmailsSvg from 'assets/images/dashboard/import-emails.svg'

import { outlookIcon } from 'components/SvgIcons/icons'
import GoogleSigninButton from 'components/GoogleSigninButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      width: 480,
      margin: '15vh auto 0',
      textAlign: 'center',
      padding: theme.spacing(3)
    },
    marginBottom4: {
      marginBottom: theme.spacing(4)
    },
    marginRight: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'InboxConnectAccount' }
)

export default function InboxConnectAccount() {
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <div className={classes.root}>
      <img
        className={classes.marginBottom4}
        src={importEmailsSvg}
        alt="Import Emails"
      />
      <Typography variant="h6">See your emails here!</Typography>
      <Typography variant="body2" className={classes.marginBottom4}>
        Connect your Google or Outlook account and see your emails here. Rechat
        helps you to be on top of your customers
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center">
        <GoogleSigninButton
          disabled={google.connecting}
          onClick={google.connect}
          className={classes.marginRight}
        >
          Sign in with Google
        </GoogleSigninButton>

        <Button
          disabled={outlook.connecting}
          onClick={outlook.connect}
          variant="outlined"
        >
          <SvgIcon
            path={outlookIcon}
            rightMargined
            color={theme.palette.info.main}
          />
          <Typography variant="button">Sign in with Outlook</Typography>
        </Button>
      </Box>
    </div>
  )
}
