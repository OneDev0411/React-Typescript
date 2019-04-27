import React from 'react'

import searchAgents from 'models/agent/search'

import { AutoComplete } from 'components/AutoComplete'

async function search(name, field) {
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

export function NameInput(props) {
  if (props.isVisible === false) {
    return false
  }

  return (
    <AutoComplete
      {...props}
      onSelect={props.mutators.setAgent}
      options={value => search(value, props.autocompleteField)}
    />
  )
}
