import React from 'react'

import searchAgents from 'models/agent/search'
import { searchContacts } from 'models/contacts/search-contacts'
import { getFullAddress } from 'models/contacts/helpers/get-contact-fulladdress'

import { AutoCompleteInput } from '../AutoCompleteInput'

function getOptionsByAttributeType(contact, type) {
  return contact.attributes
    .filter(attr => attr.attribute_type === type)
    .map(item => item.text)
}

function getAddressFromContact(contact, label) {
  const fields = [
    'street_number',
    'street_prefix',
    'street_name',
    'street_suffix',
    'unit_number',
    'city',
    'county',
    'state',
    'postal_code'
  ]
    .map(type => {
      return contact.attributes.find(
        attr => attr.attribute_type === type && attr.label === label
      )
    })
    .filter(attr => attr)

  return getFullAddress(fields)
}

export function NameInput(props) {
  const searchByName = async (name, minLength = 3) => {
    if (!name || name.length < minLength) {
      return false
    }

    try {
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
          value: contact.summary[props.searchField],
          label: contact.summary.display_name
        }))
      }

      const agents = await searchAgents(name, 'q')

      return agents.map(user => ({
        ...user,
        company: user.office ? user.office.name : '',
        value: user[props.searchField],
        label: user.full_name
      }))
    } catch (e) {
      console.log(e)
    }
  }

  return <AutoCompleteInput {...props} options={searchByName} />
}
