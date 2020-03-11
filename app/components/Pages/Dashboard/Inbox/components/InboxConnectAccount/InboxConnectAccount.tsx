import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { Typography, Theme, Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { useConnectOAuthAccount } from 'crm/List/ImportContactsButton/use-connect-oauth-account'
import importEmailsSvg from 'assets/images/dashboard/import-emails.svg'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

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
    button: {
      width: '14.6rem',
      marginBottom: theme.spacing(1)
    },
    buttonText: {
      marginLeft: theme.spacing(2),
      fontWeight: 500,
      fontFamily: 'Roboto, sans-serif',
      whiteSpace: 'nowrap'
    }
  }),
  { name: 'InboxConnectAccount' }
)

export default function InboxConnectAccount() {
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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          disabled={google.connecting}
          onClick={google.connect}
          variant="outlined"
          size="large"
          className={classes.button}
        >
          <IconGoogle />
          <Typography variant="button" className={classes.buttonText}>
            Sync with Google
          </Typography>
        </Button>

        <Button
          disabled={outlook.connecting}
          onClick={outlook.connect}
          variant="outlined"
          className={classes.button}
          size="large"
        >
          <IconOutlook />
          <Typography variant="button" className={classes.buttonText}>
            Sync with Outlook
          </Typography>
        </Button>
      </Box>
    </div>
  )
}
