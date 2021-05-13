import React from 'react'

import { useSelector } from 'react-redux'

import ContactSearchInput from 'components/ContactSearchInput'

import { selectActiveTeamId } from 'selectors/team'

import { splitFullName } from '../../helpers'

export interface ShowingStepRolePersonSelectContactProps {
  onSelect: (person: IShowingRoleInputPerson, contact?: IContact) => void
}

function ShowingStepRolePersonSelectContact({
  onSelect
}: ShowingStepRolePersonSelectContactProps) {
  const teamId = useSelector(selectActiveTeamId)

  const handleChange = (contact: IContact) => {
    onSelect(
      {
        ...splitFullName(contact.display_name),
        email: contact.email || '',
        phone_number: contact.phone_number || '',
        user: '',
        brand: contact.brand || teamId
      },
      contact
    )
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
