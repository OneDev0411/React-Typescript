import React from 'react'

import preSearchFormat from 'models/contacts/helpers/pre-search-format'

import AddToFlowButton from 'components/AddToFlowButton'
import TextIconButton from 'components/Button/TextIconButton'
import IconThunderboltOutline from 'components/SvgIcons/ThunderboltOutline/IconThunderboltOutline'

import { ActionWrapper } from '../Table/components/ActionWrapper'

function AddToFlow(props) {
  const { entireMode, selectedRows, filters } = props

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
        alphabet: filters.alphabet
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
          action="add to flow"
          disabled={disabled}
        >
          <TextIconButton
            text="Add to Flow"
            iconLeft={IconThunderboltOutline}
            size="small"
            disabled={disabled}
            iconSize="large"
            {...buttonProps}
          />
        </ActionWrapper>
      )}
    />
  )
}

export default AddToFlow
