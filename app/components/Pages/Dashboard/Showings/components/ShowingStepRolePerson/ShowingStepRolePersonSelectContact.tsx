import React from 'react'

import ContactSearchInput from 'components/ContactSearchInput'

import { splitFullName } from './helpers'

interface ShowingStepRolePersonSelectContactProps {
  onSelect: (person: IShowingRolePerson) => void
}

function ShowingStepRolePersonSelectContact({
  onSelect
}: ShowingStepRolePersonSelectContactProps) {
  const handleChange = (contact: IContact) => {
    onSelect({
      ...splitFullName(contact.display_name),
      email: contact.email || '',
      phone_number: contact.phone_number || ''
    })
  }

  const handleNew = (fullName: string) => {
    onSelect({
      ...splitFullName(fullName),
      email: '',
      phone_number: ''
    })
  }

  return <ContactSearchInput onChange={handleChange} onNew={handleNew} />
}

export default ShowingStepRolePersonSelectContact
