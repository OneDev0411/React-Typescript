import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'

import { GoogleIcon, OutlookIcon, ZeroStateContainer } from './styled'
import { useConnectOAuthAccount } from '../ImportContactsButton/use-connect-oauth-account'

export function ZeroState() {
  const google = useConnectOAuthAccount(OAuthProvider.Google)
  const outlook = useConnectOAuthAccount(OAuthProvider.Outlook)

  return (
    <ZeroStateContainer column alignCenter justifyCenter>
      <img src="/static/images/contacts/zero-state.svg" alt="" />
      <h2>No contact! Import now with one click :)</h2>
      <p>
        People and relationships are central to your business. Start building
        your referral network in Rechat by importing or creating a contact now.
      </p>

      <ActionButton
        disabled={google.connecting}
        onClick={google.connect}
        appearance="primary"
      >
        <GoogleIcon />
        Import Google Contacts
      </ActionButton>

      <ActionButton
        disabled={outlook.connecting}
        onClick={outlook.connect}
        appearance="primary"
      >
        <OutlookIcon />
        Import Outlook Contacts
      </ActionButton>

      <Divider text="OR" />

      <LinkButton appearance="outline" to="/dashboard/contacts/import/csv">
        <IconCsv style={{ marginRight: '0.4rem' }} />
        Import CSV spreadsheet
      </LinkButton>

      <CreateContact>Create Contact</CreateContact>
    </ZeroStateContainer>
  )
}
