import React from 'react'
import { browserHistory } from 'react-router'

import Tooltip from 'components/tooltip'
import PageHeader from 'components/PageHeader'
import { CreateContact } from 'components/CreateContact'
import ActionButton from 'components/Button/ActionButton'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

import TouchReminder from '../TouchReminder'

function Header({ title, isSideMenuOpen, onMenuTriggerChange, activeSegment }) {
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

        {activeSegment && activeSegment.is_editable && (
          <TouchReminder activeSegment={activeSegment} />
        )}
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
