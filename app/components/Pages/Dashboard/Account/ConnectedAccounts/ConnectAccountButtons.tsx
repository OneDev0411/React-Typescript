import React from 'react'

import { Box } from '@material-ui/core'

import { GoogleSignInButton } from 'components/GoogleSignInButton'
import { OutlookSignInButton } from 'components/OutlookSignInButton'
import { OAuthProvider } from 'constants/contacts'
import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

interface Props {
  size?: 'small' | 'medium' | 'large'
}

export default function ConnectAccountButtons({ size }: Props) {
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)
  const google = useConnectOAuthAccount(OAuthProvider.Google)

  return (
    <Box>
      <GoogleSignInButton
        disabled={google.connecting}
        onClick={google.connect}
        variant="outlined"
        size={size}
        data-tour-id="gmail-import"
      />
      &nbsp;
      <OutlookSignInButton
        disabled={outlook.connecting}
        onClick={outlook.connect}
        variant="outlined"
        size={size}
        data-tour-id="outlook-import"
      />
      {/*
      TODO: Should be implemented later
      &nbsp;
      <DocuSignConnectButton
        // disabled={outlook.connecting}
        onClick={outlook.connect}
        variant="outlined"
        size={size}
        data-tour-id="connect-docusign"
      /> */}
    </Box>
  )
}
