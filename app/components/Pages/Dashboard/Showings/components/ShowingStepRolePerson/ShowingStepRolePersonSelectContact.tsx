import React from 'react'

import { ShowingRolePerson } from '../../types'

interface ShowingStepRolePersonSelectContactProps {
  onSelect: (person: ShowingRolePerson) => void
}

function ShowingStepRolePersonSelectContact({
  onSelect
}: ShowingStepRolePersonSelectContactProps) {
  return (
    <div>
      select contact
      <button type="submit" onClick={onSelect as any}>
        select
      </button>
    </div>
  )
}

export default ShowingStepRolePersonSelectContact
