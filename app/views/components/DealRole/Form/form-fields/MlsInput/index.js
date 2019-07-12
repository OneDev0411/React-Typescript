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

      const agent = await searchAgents(mls)

      return [
        {
          ...agent,
          company: agent.office ? agent.office.name : '',
          value: agent.mlsid,
          label: agent.full_name
        }
      ]
    } catch (e) {
      /* nothing */
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
