import React from 'react'

import ContactSearchInput from 'components/ContactSearchInput'

import { splitFullName } from './helpers'

interface ShowingStepRolePersonSelectContactProps {
  onSelect: (person: IShowingRoleInputPerson) => void
}

function ShowingStepRolePersonSelectContact({
  onSelect
}: ShowingStepRolePersonSelectContactProps) {
  const handleChange = (contact: IContact) => {
    console.log('contact', contact)
    onSelect({
      ...splitFullName(contact.display_name),
      email: contact.email || '',
      phone_number: contact.phone_number || '',
      user: contact.user as string, // TODO: user or id?
      brand: contact.brand || '' // TODO: Where is brand?
    })
  }

  const handleNew = (fullName: string) => {
    onSelect({
      ...splitFullName(fullName),
      email: '',
      phone_number: '',
      user: '',
      brand: ''
    })
  }

  return <ContactSearchInput onChange={handleChange} onNew={handleNew} />
}

export default ShowingStepRolePersonSelectContact
