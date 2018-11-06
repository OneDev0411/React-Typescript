import React from 'react'
import { browserHistory } from 'react-router'

import PageHeader from '../../../../../../views/components/PageHeader'
import { CreateContact } from '../../../../../../views/components/CreateContact'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { Trigger as MenuTrigger } from '../../../../../../views/components/SlideMenu'
import Tooltip from 'components/tooltip'

export function Header({ title, isSideMenuOpen, onMenuTriggerChange }) {
  return (
    <PageHeader>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger
          isExpended={isSideMenuOpen}
          onClick={onMenuTriggerChange}
        />
        <PageHeader.Heading>{title}</PageHeader.Heading>
      </PageHeader.Title>

      <PageHeader.Menu>
        {/* <Import userId={user.id} /> */}

        <Tooltip caption="From CSV Spreadsheet" placement="bottom">
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

        <CreateContact />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
