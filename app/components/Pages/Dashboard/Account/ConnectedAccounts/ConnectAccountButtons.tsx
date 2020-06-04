import { OAuthProvider } from 'constants/contacts'

import React from 'react'
import { Box, Button } from '@material-ui/core'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

interface Props {
  size?: 'small' | 'medium' | 'large'
}

export default function ConnectAccountButtons({ size }: Props) {
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)
  const google = useConnectOAuthAccount(OAuthProvider.Google)

  const iconSize = { width: 16, height: 16 }

  return (
    <Box>
      <Button
        variant="outlined"
        size={size}
        disabled={outlook.connecting}
        onClick={outlook.connect}
      >
        <Box marginRight={1} />
        <IconOutlook size={iconSize} />
        <Box marginX={1}>Connect Outlook</Box>
      </Button>
      <Box display="inline-block" mr={2} />
      <Button
        variant="outlined"
        size={size}
        disabled={google.connecting}
        onClick={google.connect}
      >
        <Box marginRight={1} />
        <IconGoogle size={iconSize} />
        <Box marginX={1}>Connect Google</Box>
      </Button>
    </Box>
  )
}
