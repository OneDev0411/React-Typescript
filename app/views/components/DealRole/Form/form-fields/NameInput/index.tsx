import React, { useState, useCallback } from 'react'

import { FieldInputProps, FieldMetaState } from 'react-final-form'

import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { AutoComplete, Option } from '../../components/AutoComplete'

type NormalizedContact = {
  contact: IContact
  phone_numbers: string[]
  emails: string[]
  companies: string[]
  value: string
  label: string
}

type NormalizedAgent = IAgent & {
  company: string
  value: string
  label: string
}

interface Props {
  label: string
  searchFieldValue: keyof IContact
  searchFieldLabel: keyof IContact
  isVisible: boolean
  isRequired: boolean
  crmSearch: boolean
  autoTrim?: boolean
  input: FieldInputProps<any, HTMLElement>
  meta: FieldMetaState<any>
  mutators: any // TODO: fix mutators types
}

export function NameInput({
  label,
  searchFieldValue,
  searchFieldLabel,
  crmSearch,
  isVisible,
  isRequired,
  input,
  meta,
  mutators,
  autoTrim = true
}: Props) {
  const [isSearching, setIsSearching] = useState(false)

  const handleSelectSuggestion = (option: Option) => {
    mutators.populateRole(option)
  }

  const searchByName = useCallback(
    async (name: string): Promise<NormalizedContact[] | NormalizedAgent[]> => {
      if (!name || name.length < 3) {
        return []
      }

      try {
        setIsSearching(true)

        if (crmSearch) {
          const { data: contacts } = await searchContacts(name)

          setIsSearching(false)

          return contacts
            .filter(contact => !!contact[searchFieldValue])
            .map((contact: IContact) => ({
              contact,
              ...contact,
              phone_numbers: getOptionsByAttributeType(contact, 'phone_number'),
              emails: getOptionsByAttributeType(contact, 'email'),
              companies: getOptionsByAttributeType(contact, 'company'),
              current_address:
                Array.isArray(contact.address) && contact.address.length > 0
                  ? contact.address[0]
                  : null,
              value: (contact[searchFieldValue] || '') as string,
              label: (contact[searchFieldLabel] || '') as string
            }))
        }

        const agents: IAgent[] = await searchAgents(name, 'q')

        setIsSearching(false)

        return agents.map(agent => ({
          ...agent,
          company: agent.office ? agent.office.name : '',
          value: agent.full_name || `${agent.first_name} ${agent.last_name}`,
          label: agent.full_name || `${agent.first_name} ${agent.last_name}`
        }))
      } catch (e) {
        setIsSearching(false)

        return []
      }
    },
    [crmSearch, searchFieldValue, searchFieldLabel]
  )

  const getNoOptionsText = () => {
    if (crmSearch) {
      return isSearching
        ? 'Searching your contacts'
        : 'Type to search your contacts'
    }

    return isSearching ? 'Searching MLS agents' : 'Type to search MLS agents'
  }

  if (!isVisible) {
    return null
  }

  return (
    <AutoComplete
      label={`${label}${isRequired ? ' *' : ''}`}
      value={input.value}
      error={meta.error || (isRequired && !input.value)}
      noOptionsText={getNoOptionsText()}
      getOptionLabel={option => option.full_name || option.value}
      isLoading={isSearching}
      autoTrim={autoTrim}
      options={searchByName}
      onChange={handleSelectSuggestion}
      onInputChange={input.onChange}
    />
  )
}

function getOptionsByAttributeType(contact: IContact, type: string) {
  return contact
    .attributes!.filter(attr => attr.attribute_type === type)
    .map(item => item.text)
}
