import React from 'react'

import { Button } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'

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
  return (
    <PopoverContactTagSelector
      anchorRenderer={onClick => (
        <Button
          disabled={disabled}
          variant="outlined"
          size="small"
          onClick={onClick}
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
