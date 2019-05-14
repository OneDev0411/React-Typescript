import React from 'react'

import searchAgents from 'models/agent/search'

import { AutoCompleteInput } from '../AutoCompleteInput'

async function searchByMlsId(mls, minLength = 6) {
  if (!mls || mls.length < minLength) {
    return false
  }

  try {
    const agent = await searchAgents(mls)

    return [
      {
        ...agent,
        value: agent.mlsid,
        label: agent.full_name
      }
    ]
  } catch (e) {
    /* nothing */
  }
}

export function MlsInput(props) {
  return (
    <AutoCompleteInput
      {...props}
      options={searchByMlsId}
      searchConfiguration={{
        keys: ['value']
      }}
    />
  )
}
