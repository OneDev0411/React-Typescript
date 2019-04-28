import React from 'react'
import _ from 'underscore'

import searchAgents from 'models/agent/search'
import { AutoComplete } from 'components/AutoComplete'

async function searchByMlsId(mls) {
  if (!mls || mls.length < 6) {
    return false
  }

  try {
    const agent = await searchAgents(mls)

    return [
      {
        ...agent,
        value: agent.mlsid,
        label: `${agent.full_name} (${agent.mlsid})`
      }
    ]
  } catch (e) {
    /* nothing */
  }
}

async function searchByName(name, field) {
  if (!name || name.length < 2) {
    return false
  }

  try {
    const list = await searchAgents(name, 'q')

    return list.map(agent => ({
      ...agent,
      value: agent[field],
      label: agent.full_name
    }))
  } catch (e) {
    /* nothing */
  }
}

export function AutoCompleteInput(props) {
  if (props.isVisible === false) {
    return false
  }

  const getOptions = value => {
    if (props.options) {
      return props.options
    }

    if (props.input.name === 'mls_id') {
      return searchByMlsId(value, 'mlsid')
    }

    return searchByName(value, props.autocompleteField)
  }

  return (
    <AutoComplete
      {...props}
      onSelect={item => props.mutators && props.mutators.setAgent(item)}
      options={getOptions}
      inputProps={{
        highlightOnError: true
      }}
    />
  )
}
