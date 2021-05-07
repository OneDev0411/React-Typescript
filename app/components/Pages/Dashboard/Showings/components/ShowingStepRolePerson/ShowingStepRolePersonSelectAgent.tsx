import React from 'react'

import AgentSearchInput from 'components/AgentSearchInput'

interface ShowingStepRolePersonSelectAgentProps {
  onSelect: (person: IShowingRoleInputPerson) => void
}

function ShowingStepRolePersonSelectAgent({
  onSelect
}: ShowingStepRolePersonSelectAgentProps) {
  const handleChange = (agent: IUser) =>
    onSelect({
      first_name: agent.first_name || '',
      last_name: agent.last_name || '',
      email: agent.email,
      phone_number: agent.phone_number || '',
      user: agent.id,
      brand: agent.brand as string
    })

  return <AgentSearchInput isPrimaryAgent={false} onChange={handleChange} />
}

export default ShowingStepRolePersonSelectAgent
