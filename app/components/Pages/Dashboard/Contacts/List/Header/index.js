import React from 'react'
import { browserHistory } from 'react-router'

import PageHeader from '../../../../../../views/components/PageHeader'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'
import Tooltip from 'components/tooltip'

export function Header({ title, isSideMenuOpen, onMenuTriggerChange }) {
  return (
    <PageHeader isFlat style={{ marginBottom: '1.5em', padding: '0 1.5em' }}>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger
          isExpended={isSideMenuOpen}
          onClick={onMenuTriggerChange}
        />
        <PageHeader.Heading>{title}</PageHeader.Heading>
      </PageHeader.Title>

      <PageHeader.Menu>
        {/* <Import userId={user.id} /> */}

        <Tooltip caption="Import from CSV Spreadsheet" placement="bottom">
          <ActionButton
            appearance="outline"
            style={{ marginRight: '1em' }}
            onClick={() =>
              browserHistory.push('/dashboard/contacts/import/csv')
            }
          >
            Import Contacts
          </ActionButton>
        </Tooltip>

        <ActionButton
          onClick={() => browserHistory.push('/dashboard/contacts/new')}
        >
          New Contact
        </ActionButton>
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
