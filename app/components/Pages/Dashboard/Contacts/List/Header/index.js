import React from 'react'
import { connect } from 'react-redux'

import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers'

import { updateFilterSegment } from 'actions/filter-segments'

import PageHeader from 'components/PageHeader'
import { CreateContact } from 'components/CreateContact'
import { Trigger as MenuTrigger } from 'components/SlideMenu'

import TouchReminder from '../TouchReminder'
import ImportContactsButton from '../ImportContactsButton'
import { CONTACTS_SEGMENT_NAME } from '../../constants'

const DEFAULT_QUERY = {
  associations: CRM_LIST_DEFAULT_ASSOCIATIONS
}

function Header({
  title,
  isSideMenuOpen,
  onMenuTriggerChange,
  activeSegment,
  showActions,
  showImportAction,
  showCreateAction,
  updateSegment
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
              onChange={async value => {
                const segment = {
                  ...activeSegment,
                  touch_freq: value
                }

                await updateSegment(
                  CONTACTS_SEGMENT_NAME,
                  segment,
                  DEFAULT_QUERY
                )
              }}
            />
          )}
          {showImportAction && <ImportContactsButton />}
          {showCreateAction && <CreateContact />}
        </PageHeader.Menu>
      )}
    </PageHeader>
  )
}

export default connect(
  null,
  {
    updateSegment: updateFilterSegment
  }
)(Header)
