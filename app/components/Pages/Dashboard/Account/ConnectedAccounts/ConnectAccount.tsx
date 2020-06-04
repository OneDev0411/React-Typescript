import React from 'react'
import { Theme, Typography, Box } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import ConnectAccountButtons from './ConnectAccountButtons'

export default function ConnectAccount() {
  const theme = useTheme<Theme>()

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
      <ConnectAccountButtons size="large" />
    </Box>
  )
}
