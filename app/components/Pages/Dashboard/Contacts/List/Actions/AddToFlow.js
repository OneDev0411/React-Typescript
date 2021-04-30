import React from 'react'

import { mdiLightningBolt } from '@mdi/js'

import preSearchFormat from 'models/contacts/helpers/pre-search-format'

import AddToFlowButton from 'components/AddToFlowButton'
import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'

function AddToFlow({ disabled, ...props }) {
  const { entireMode, selectedRows, filters, parked } = props

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
        <GridActionButton
          label="Add to Flow"
          icon={mdiLightningBolt}
          onClick={e => buttonProps?.onClick(e)}
        />
      )}
    />
  )
}

export default AddToFlow
