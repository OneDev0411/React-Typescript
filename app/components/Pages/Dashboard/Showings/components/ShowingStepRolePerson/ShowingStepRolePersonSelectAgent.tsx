import React from 'react'

import { ShowingRolePerson } from '../../types'

interface ShowingStepRolePersonSelectAgentProps {
  onSelect: (person: ShowingRolePerson) => void
}

function ShowingStepRolePersonSelectAgent({
  onSelect
}: ShowingStepRolePersonSelectAgentProps) {
  return (
    <div>
      select agent
      <button type="submit" onClick={onSelect as any}>
        select
      </button>
    </div>
  )
}

export default ShowingStepRolePersonSelectAgent
