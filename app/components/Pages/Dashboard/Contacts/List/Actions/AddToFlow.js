import React from 'react'

import { Button } from '@material-ui/core'

import preSearchFormat from 'models/contacts/helpers/pre-search-format'

import AddToFlowButton from 'components/AddToFlowButton'

import { ActionWrapper } from '../Table/components/ActionWrapper'

function AddToFlow(props) {
  const { entireMode, selectedRows, filters, parked } = props

  const disabled = !entireMode && selectedRows.length === 0

  const getData = () => {
    let data = {}

    if (disabled) {
      return data
    }

    const [payload, queryParams] = preSearchFormat({
      attributeFilters: filters.attributeFilters,
      crm_tasks: filters.crm_tasks,
      flows: filters.flows,
      text: filters.text,
      users: filters.users,
      queryParams: {
        filter_type: filters.filter_type,
        alphabet: filters.alphabet,
        parked
      }
    })

    data = {
      ...payload,
      ...queryParams
    }

    if (entireMode) {
      data.excludes = props.excludedRows
    } else {
      data.ids = selectedRows
    }

    return data
  }

  return (
    <AddToFlowButton
      contacts={getData()}
      callback={async () => {
        props.resetSelectedRows()
        await props.reloadContacts()
      }}
      buttonRenderer={buttonProps => (
        <ActionWrapper
          bulkMode={entireMode}
          action="add to Flow"
          disabled={disabled}
        >
          <Button
            variant="outlined"
            size="small"
            disabled={disabled}
            {...buttonProps}
          >
            Add to Flow
          </Button>
        </ActionWrapper>
      )}
    />
  )
}

export default AddToFlow
