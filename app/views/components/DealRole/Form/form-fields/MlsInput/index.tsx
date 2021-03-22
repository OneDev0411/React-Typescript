import React, { useCallback, useState } from 'react'
import { FieldInputProps } from 'react-final-form'

import searchAgents from 'models/agent/search'

import { AutoComplete, Option } from '../../components/AutoComplete'

interface Props {
  label: string
  isVisible: boolean
  isRequired: boolean
  input: FieldInputProps<any, HTMLElement>
  mutators: any // TODO: fix mutators types
}

type NormalizedAgent = IAgent & {
  company: string
  value: string
  label: string
}

export function MlsInput({ label, isVisible, input, mutators }: Props) {
  const [isSearching, setIsSearching] = useState(false)

  const handleSelectSuggestion = (option: Option) => {
    mutators.populateRole(option)
  }

  const searchByMlsId = useCallback(async (mls: string): Promise<
    NormalizedAgent[]
  > => {
    if (!mls || mls.length < 6) {
      return []
    }

    try {
      setIsSearching(true)

      const agents: IAgent[] = await searchAgents(mls)

      setIsSearching(false)

      return agents.map(agent => ({
        ...agent,
        company: agent.office ? agent.office.name : '',
        value: agent.mlsid,
        label: agent.full_name
      }))
    } catch (e) {
      setIsSearching(false)

      return []
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <AutoComplete
      label={label}
      value={input.value}
      noOptionsText={
        isSearching ? 'Searching MLS agents' : 'Type to search MLS agents'
      }
      isLoading={isSearching}
      options={searchByMlsId}
      getOptionLabel={option => `${option.label} (${option.value})`}
      onChange={handleSelectSuggestion}
      onInputChange={input.onChange}
    />
  )
}
