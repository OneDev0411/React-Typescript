import React from 'react'

import PageHeader from 'components/PageHeader'
import { CreateContact } from 'components/CreateContact'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

import TouchReminder from '../TouchReminder'
import ImportContactsButton from '../ImportContactsButton'

export default function Header({
  title,
  isSideMenuOpen,
  onMenuTriggerChange,
  activeSegment,
  activeTag,
  showActions,
  showImportAction,
  showCreateAction,
  onListTouchReminderUpdate,
  onTagTouchReminderUpdate
}) {
  return (
    <PageHeader style={{ height: '5.0625rem' }}>
      <PageHeader.Title showBackButton={false}>
        <MenuTrigger
          isExpended={isSideMenuOpen}
          onClick={onMenuTriggerChange}
        />
        <PageHeader.Heading>{title}</PageHeader.Heading>
      </PageHeader.Title>

      {showActions && (
        <PageHeader.Menu>
          {activeSegment && activeSegment.is_editable && (
            <TouchReminder
              value={activeSegment.touch_freq}
              onChange={onListTouchReminderUpdate}
            />
          )}
          {activeTag && activeTag.id && (
            <TouchReminder
              value={activeTag.touch_freq}
              onChange={onTagTouchReminderUpdate}
            />
          )}
          {showImportAction && <ImportContactsButton />}
          {showCreateAction && <CreateContact />}
        </PageHeader.Menu>
      )}
    </PageHeader>
  )
}
