import { Button } from '@material-ui/core'

import { ZeroState } from 'partials/ZeroState'

import { OAuthProvider } from 'constants/contacts'

import { OutlookSignInButton } from 'components/OutlookSignInButton'

import { GoogleSignInButton } from 'components/GoogleSignInButton'

import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'

import { useConnectOAuthAccount } from 'hooks/use-connect-oauth-account'

export function ContactsZeroState() {
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <ZeroState
      imageUrl="/static/images/zero-state/contacts.jpg"
      title="No contacts! Import now with one click."
      subTitle="People and relationships are central to your business. Start building
      your referral network in Rechat by importing or creating a contact now."
      ctaNode={
        <>
          <GoogleSignInButton
            disabled={google.connecting}
            onClick={google.connect}
            variant="outlined"
            size="large"
            data-tour-id="gmail-import"
          />
          <OutlookSignInButton
            disabled={outlook.connecting}
            onClick={outlook.connect}
            variant="outlined"
            size="large"
            data-tour-id="outlook-import"
          />
          <Divider text="OR" margin="2rem 0" />

          <Button
            size="large"
            variant="outlined"
            href="/dashboard/contacts/import/csv"
          >
            Import from CSV file
          </Button>

          <CreateContact
            showAddAnother={false}
            buttonProps={{ size: 'large' }}
          />
        </>
      }
    />
  )
}
