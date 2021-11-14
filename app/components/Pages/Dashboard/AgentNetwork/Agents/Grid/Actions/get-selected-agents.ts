import { AgentWithStats } from '@app/models/agent-network/get-agents'

export function getSelectedAgents(
  agentsData: AgentWithStats[],
  selectedRows: UUID[]
): IAgent[] {
  if (agentsData.length === 0 || selectedRows.length === 0) {
    return []
  }

  // Sometimes an agent can have a null id!
  return agentsData
    .filter(item => item.id && selectedRows.includes(item.id))
    .map(agent => agent)
}
