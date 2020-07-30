import React from 'react'
import { Box, Button, useTheme } from '@material-ui/core'

import { OAuthProvider } from 'constants/contacts'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import { outlookIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  size?: 'small' | 'medium' | 'large'
}

export default function ConnectAccountButtons({ size }: Props) {
  const theme = useTheme()
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
        <SvgIcon path={outlookIcon} color={theme.palette.info.main} />
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
