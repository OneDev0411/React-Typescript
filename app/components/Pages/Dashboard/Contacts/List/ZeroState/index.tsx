import * as React from 'react'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'

import ConnectGoogleButton from '../ImportContactsButton/ConnectGoogleButton'
import { GoogleIcon, ZeroStateContainer } from './styled'

export function ZeroState() {
  return (
    <ZeroStateContainer column alignCenter justifyCenter>
      <img src="/static/images/contacts/zero-state.svg" alt="" />
      <h2>Houston, we have no contacts.</h2>
      <p>
        People are central to your day to day business. Start building your
        referral network in Rechat by importing or creating a contact manually.
      </p>

      <ConnectGoogleButton>
        {({ connecting, connect }) => (
          <ActionButton
            disabled={connecting}
            onClick={connect}
            appearance="primary"
          >
            <GoogleIcon />
            Import Google Contacts
          </ActionButton>
        )}
      </ConnectGoogleButton>

      <Divider text="OR" />

      <LinkButton appearance="outline" to="/dashboard/contacts/import/csv">
        <IconCsv style={{ marginRight: '0.4rem' }} />
        Import CSV spreadsheet
      </LinkButton>

      <CreateContact>Create Contact</CreateContact>
    </ZeroStateContainer>
  )
}
