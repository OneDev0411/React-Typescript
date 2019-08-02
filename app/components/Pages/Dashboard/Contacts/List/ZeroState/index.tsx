import * as React from 'react'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'

import ConnectGoogleButton from '../ImportContactsButton/ConnectGoogleButton'
import ConnectOutlookButton from '../ImportContactsButton/ConnectOutlookButton'
import { GoogleIcon, OutlookIcon, ZeroStateContainer } from './styled'

export function ZeroState() {
  return (
    <ZeroStateContainer column alignCenter justifyCenter>
      <img src="/static/images/contacts/zero-state.svg" alt="" />
      <h2>Houston, we have zero contacts.</h2>
      <p>
        People and relationships are central to your business. Start building
        your referral network in Rechat by importing or creating a contact now.
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

      <ConnectOutlookButton>
        {({ connecting, connect }) => (
          <ActionButton
            disabled={connecting}
            onClick={connect}
            appearance="primary"
          >
            <OutlookIcon />
            Import Outlook Contacts
          </ActionButton>
        )}
      </ConnectOutlookButton>

      <Divider text="OR" />

      <LinkButton appearance="outline" to="/dashboard/contacts/import/csv">
        <IconCsv style={{ marginRight: '0.4rem' }} />
        Import CSV spreadsheet
      </LinkButton>

      <CreateContact>Create Contact</CreateContact>
    </ZeroStateContainer>
  )
}
