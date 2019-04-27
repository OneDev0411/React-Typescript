import React from 'react'

import searchAgent from 'models/agent/search'

import { AutoComplete } from 'components/AutoComplete'

async function searchByMlsId(mls) {
  if (!mls || mls.length < 6) {
    return false
  }

  try {
    const agent = await searchAgent(mls)

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

export function MlsIdInput(props) {
  if (props.isVisible === false) {
    return false
  }

  return (
    <AutoComplete
      {...props}
      options={searchByMlsId}
      onSelect={props.mutators.setAgent}
    />
  )
}
