import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { Theme, Typography, Box, Button } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import { useConnectOAuthAccount } from 'crm/List/ImportContactsButton/use-connect-oauth-account'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

export default function ConnectAccounts() {
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)
  const google = useConnectOAuthAccount(OAuthProvider.Google)

  const theme = useTheme<Theme>()

  const iconSize = { width: 16, height: 16 }

  return (
    <Box
      height="calc(100vh - 240px)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box marginBottom={2}>
        <Typography variant="h6">No Account Connected Yet</Typography>
      </Box>
      <Box maxWidth={theme.spacing(60)} marginBottom={5} textAlign="center">
        <Typography variant="body2">
          Connect your Google or Outlook account and see your emails, contacts
          and calendar events right from inside Rechat.
        </Typography>
      </Box>
      <Box>
        <Button
          variant="outlined"
          size="large"
          disabled={outlook.connecting}
          onClick={outlook.connect}
        >
          <IconOutlook size={iconSize} />
          <Box pl={1}>Connect Outlook</Box>
        </Button>
        <Box display="inline-block" mr={2} />
        <Button
          variant="outlined"
          size="large"
          disabled={google.connecting}
          onClick={google.connect}
        >
          <IconGoogle size={iconSize} />
          <Box pl={1}>Connect Google</Box>
        </Button>
      </Box>
    </Box>
  )
}
