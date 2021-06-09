import AgentSearchInput from '../AgentSearchInput'

export interface ShowingStepRolePersonSelectAgentProps {
  isPrimaryAgent?: boolean
  isTeamAvailableMembers?: boolean
  onSelect: (person: IShowingRoleInputPerson) => void
}

function ShowingStepRolePersonSelectAgent({
  isPrimaryAgent = false,
  isTeamAvailableMembers = false,
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

  return (
    <AgentSearchInput
      isPrimaryAgent={isPrimaryAgent}
      isTeamAvailableMembers={isTeamAvailableMembers}
      onChange={handleChange}
    />
  )
}

export default ShowingStepRolePersonSelectAgent
