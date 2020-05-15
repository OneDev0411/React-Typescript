import React, { useState, useCallback } from 'react'

import searchAgents from 'models/agent/search'

import { AutoCompleteInput } from '../AutoCompleteInput'

export function MlsInput(props) {
  const [isSearching, setIsSearching] = useState(false)

  const searchByMlsId = async (mls, minLength = 6) => {
    if (!mls || mls.length < minLength) {
      return false
    }

    try {
      setIsSearching(true)

      const agents = await searchAgents(mls)

      return agents.map(agent => ({
        ...agent,
        company: agent.office ? agent.office.name : '',
        value: agent.mlsid,
        label: agent.full_name
      }))
    } catch (e) {
      console.log(e)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <AutoCompleteInput
      {...props}
      options={useCallback(searchByMlsId)}
      hintMessage={
        isSearching ? 'Searching MLS agents' : 'Type to search MLS agents'
      }
      showHintOnFocus
      searchConfiguration={{
        keys: ['value']
      }}
    />
  )
}
