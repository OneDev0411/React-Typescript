import React, { useState } from 'react'

import { mdiTagOutline } from '@mdi/js'
import intersection from 'lodash/intersection'
import { useSelector } from 'react-redux'

import { PopoverContactTagSelector } from '@app/components/Pages/Dashboard/Contacts/components/TagSelector'
import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import { SelectorOption } from 'components/TagSelector'
import { selectContact } from 'reducers/contacts/list'
import { selectContactListStore } from 'selectors/contacts'

interface Props {
  disabled?: boolean
  entireMode?: boolean
  selectedRows: UUID[]
  excludedRows: UUID[]
  attributeFilters?: IContactAttributeFilter[]
  searchText?: string
  conditionOperator?: TContactFilterType
  users?: UUID[]
  crm_tasks?: UUID[]
  flows?: UUID[]
  isParkedActive: boolean
  resetSelectedRows: () => void
  handleChangeContactsAttributes: () => void
}

export const TagContacts = ({
  disabled = false,
  entireMode = false,
  selectedRows,
  excludedRows,
  isParkedActive,
  attributeFilters = [],
  searchText = '',
  conditionOperator,
  users = [],
  crm_tasks = [],
  flows = [],
  resetSelectedRows,
  handleChangeContactsAttributes
}: Props) => {
  const [currentTags, setCurrentTags] = useState<SelectorOption[]>([])
  const contactListStore = useSelector(selectContactListStore)

  const getCommonTags = () => {
    if (selectedRows.length === 0 || entireMode) {
      return
    }

    const contactsTags = selectedRows.map(contactId => {
      const contact = selectContact(contactListStore, contactId)

      if (contact) {
        return contact.tags || []
      }

      return []
    })

    const filteredTags = intersection<string>(...contactsTags).map(tag => ({
      title: tag,
      value: tag
    }))

    setCurrentTags(filteredTags)
  }

  return (
    <PopoverContactTagSelector
      label="Bulk Tagging"
      value={currentTags}
      anchorRenderer={onClick => (
        <GridActionButton
          label="Tag"
          icon={mdiTagOutline}
          disabled={disabled}
          tourId="tag-contacts"
          onClick={e => {
            if (!entireMode) {
              getCommonTags()
            }

            onClick(e)
          }}
        />
      )}
      popoverProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left'
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'left'
        }
      }}
      filter={{
        selectedIds: selectedRows,
        excludes: excludedRows,
        attributes: attributeFilters,
        parked: isParkedActive,
        searchText,
        conditionOperator,
        users,
        crm_tasks,
        flows
      }}
      callback={() => {
        resetSelectedRows()
        handleChangeContactsAttributes()
      }}
    />
  )
}
