import React from 'react'

import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'

import { AutoCompleteInput } from '../AutoCompleteInput'

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
