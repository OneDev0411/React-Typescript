import React from 'react'
import PageHeader from 'components/PageHeader'
import { CreateContact } from 'components/CreateContact'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

import TouchReminder from '../TouchReminder'
import ImportContactsButton from '../ImportContactsButton'

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

        <ImportContactsButton />

        <CreateContact />
      </PageHeader.Menu>
    </PageHeader>
  )
}

export default Header
