import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import intersection from 'lodash/intersection'

import { Button } from '@material-ui/core'

import { selectContact } from 'reducers/contacts/list'

import { IAppState } from 'reducers'

import { PopoverContactTagSelector } from 'components/TagSelector'
import { SelectorOption } from 'components/TagSelector/type'

interface Props {
  disabled: boolean
  entireMode: boolean
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
  const { contactListStore } = useSelector((store: IAppState) => {
    const { list: contactListStore } = store.contacts

    return {
      contactListStore
    }
  })

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
      value={currentTags}
      anchorRenderer={onClick => (
        <Button
          disabled={disabled}
          variant="outlined"
          size="small"
          onClick={e => {
            if (!entireMode) {
              getCommonTags()
            }

            onClick(e)
          }}
        >
          Tag
        </Button>
      )}
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
