import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { Typography, Theme, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import ActionButton from 'components/Button/ActionButton'
import { useConnectOAuthAccount } from 'crm/List/ImportContactsButton/use-connect-oauth-account'

import importEmailsSvg from './images/import-emails.svg'
import { GoogleIcon, OutlookIcon } from './icons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      textAlign: 'center',
      width: 477
    },
    button: {
      height: 'unset !important',
      padding: '12px 16px !important',
      lineHeight: '16px !important'
    }
  }),
  { name: 'InboxConnectAccount' }
)

export default function InboxConnectAccount() {
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <img src={importEmailsSvg} alt="Import Emails" />
      <Box paddingTop={3}>
        <Typography variant="h6">See your emails here!</Typography>
      </Box>
      <Box paddingTop={2}>
        <Typography variant="body2">
          Connect your Google or Outlook account and see your emails here.
          Rechat helps you to be on top of your customers
        </Typography>
      </Box>
      <Box paddingTop={5}>
        <ActionButton
          disabled={google.connecting}
          onClick={google.connect}
          appearance="outline"
          className={classes.button}
        >
          <GoogleIcon />
          Connect Google
        </ActionButton>
        <Box marginLeft={2} display="inline">
          <ActionButton
            disabled={outlook.connecting}
            onClick={outlook.connect}
            appearance="outline"
            className={classes.button}
          >
            <OutlookIcon />
            Connect Outlook
          </ActionButton>
        </Box>
      </Box>
    </div>
  )
}
