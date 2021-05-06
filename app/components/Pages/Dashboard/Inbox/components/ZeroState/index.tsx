import { Button } from '@material-ui/core'

import { OAuthProvider } from 'constants/contacts'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

import { ZeroState } from 'partials/ZeroState'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

export default function InboxZeroState() {
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <ZeroState
      imageUrl="/static/images/zero-state/inbox.jpg"
      title="See your emails here!"
      subTitle="Connect your Google or Outlook account and see your emails here.
    Rechat helps you to be on top of your customers."
      cta={
        <>
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
        </>
      }
    />
  )
}
