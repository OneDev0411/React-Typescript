import React from 'react'

import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { AutoCompleteInput } from '../AutoCompleteInput'

function getOptionsByAttributeType(contact, type) {
  return contact.attributes
    .filter(attr => attr.attribute_type === type)
    .map(item => item.text)
}

export function NameInput(props) {
  const searchByName = async (name, minLength = 2) => {
    if (!name || name.length < minLength) {
      return false
    }

    try {
      if (props.crmSearch) {
        const { data: contacts } = await searchContacts(name)

        return contacts.map(contact => ({
          ...contact.summary,
          phone_numbers: getOptionsByAttributeType(contact, 'phone_number'),
          emails: getOptionsByAttributeType(contact, 'email'),
          companies: getOptionsByAttributeType(contact, 'company'),
          value: contact.summary[props.searchField],
          label: contact.summary.display_name
        }))
      }

      const agents = await searchAgents(name, 'q')

      return agents.map(user => ({
        ...user,
        value: user[props.searchField],
        label: user.full_name
      }))
    } catch (e) {
      console.log(e)
    }
  }

  return <AutoCompleteInput {...props} options={searchByName} />
}
