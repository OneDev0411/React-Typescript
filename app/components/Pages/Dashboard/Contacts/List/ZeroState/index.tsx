import Flex from 'styled-flex-component'
import * as React from 'react'
import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import { Divider } from 'components/Divider'
import { CreateContact } from 'components/CreateContact'

import ConnectGoogleButton from '../ImportContactsButton/ConnectGoogleButton'

const ZeroStateContainer = styled(Flex)`
  height: calc(100% - 120px);
  max-width: 505px;
  margin: auto;
  text-align: center;

  ${ActionButton}, ${LinkButton}, ${Divider} {
    text-align: center;
    justify-content: center;
    margin-top: 1rem;
    width: 14.6rem;
  }
`

const GoogleIcon = styled(IconGoogle)`
  margin-right: 0.4rem;
  background: #fff;
  border-radius: 50%;
  padding: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
`

export function ZeroState() {
  return (
    <ZeroStateContainer column alignCenter justifyCenter>
      <img src="/static/images/contacts/zero-state.svg" />
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
