import React from 'react'

import { Button } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'

export const TagContacts = props => {
  return (
    <PopoverContactTagSelector
      anchorRenderer={onClick => (
        <Button
          disabled={props.disabled}
          variant="outlined"
          size="small"
          onClick={onClick}
        >
          Tag
        </Button>
      )}
      filter={{
        selectedIds: props.selectedRows,
        excludes: props.excludedRows,
        attributes: props.filters?.attributeFilters,
        searchText: props.filters?.text,
        conditionOperator: props.filters?.filter_type,
        users: props.filters?.users,
        crm_tasks: props.filters?.crm_tasks,
        flows: props.filters?.flows,
        parked: props.isParkedActive
      }}
      callback={() => {
        props.resetSelectedRows()
        props.handleChangeContactsAttributes()
      }}
    />
  )
}
