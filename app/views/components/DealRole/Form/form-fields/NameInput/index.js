import React, { useState, useCallback } from 'react'

import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { AutoCompleteInput } from '../AutoCompleteInput'

function getOptionsByAttributeType(contact, type) {
  return contact.attributes
    .filter(attr => attr.attribute_type === type)
    .map(item => item.text)
}

function getAddressFromContact(contact, label) {
  if (!Array.isArray(contact.address)) {
    return null
  }

  const address = contact.address.find(
    addressItem => addressItem.extra === label
  )

  if (!address) {
    return null
  }

  return address
}

export function NameInput(props) {
  const [isSearching, setIsSearching] = useState(false)

  const searchByName = async (name, minLength = 3) => {
    if (!name || name.length < minLength) {
      return false
    }

    try {
      setIsSearching(true)

      if (props.crmSearch) {
        const { data: contacts } = await searchContacts(name)

        return contacts.map(contact => ({
          contact,
          ...contact.summary,
          phone_numbers: getOptionsByAttributeType(contact, 'phone_number'),
          emails: getOptionsByAttributeType(contact, 'email'),
          companies: getOptionsByAttributeType(contact, 'company'),
          current_address: getAddressFromContact(contact, 'Past'),
          future_address: getAddressFromContact(contact, 'Home'),
          value: contact.summary[props.searchFieldValue],
          label: contact.summary[props.searchFieldLabel]
        }))
      }

      const agents = await searchAgents(name, 'q')

      return agents.map(agent => ({
        ...agent,
        company: agent.office ? agent.office.name : '',
        value: agent[props.searchFieldValue],
        label: agent.full_name
      }))
    } catch (e) {
      console.log(e)
    } finally {
      setIsSearching(false)
    }
  }

  const getHintMessage = () => {
    if (props.crmSearch) {
      return isSearching
        ? 'Searching your contacts'
        : 'Type to search your contacts'
    }

    return isSearching ? 'Searching MLS agents' : 'Type to search MLS agents'
  }

  return (
    <AutoCompleteInput
      {...props}
      options={useCallback(searchByName)}
      hintMessage={getHintMessage()}
      showHintOnFocus
    />
  )
}
