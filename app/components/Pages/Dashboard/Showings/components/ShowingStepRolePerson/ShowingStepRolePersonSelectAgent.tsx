import React from 'react'

import AgentSearchInput from 'components/AgentSearchInput'

import { ShowingRolePerson } from '../../types'

interface ShowingStepRolePersonSelectAgentProps {
  onSelect: (person: ShowingRolePerson) => void
}

function ShowingStepRolePersonSelectAgent({
  onSelect
}: ShowingStepRolePersonSelectAgentProps) {
  const handleChange = (agent: IUser) => {
    onSelect({
      first_name: agent.first_name || '',
      last_name: agent.last_name || '',
      email: agent.email,
      phone_number: agent.phone_number || ''
    })
  }

  return (
    <AgentSearchInput
      flattenTeams
      isPrimaryAgent={false}
      onChange={handleChange}
    />
  )
}

export default ShowingStepRolePersonSelectAgent
