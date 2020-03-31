import { IDealAgent } from 'deals/AgentNetwork/types'

export function getRecipients(
  data: IDealAgent[],
  selectedRows: UUID[]
): IDenormalizedEmailRecipientDealAgentInput[] {
  if (
    Array.isArray(data) === false ||
    Array.isArray(selectedRows) === false ||
    data.length === 0 ||
    selectedRows.length === 0
  ) {
    return []
  }

  // Sometimes an agent can have a null id and email
  // in this cases we need to make sure filtering them out
  return data
    .filter(
      item =>
        item.agent &&
        item.agentId &&
        selectedRows.includes(item.id) &&
        (item.agent.email || item.email)
    )
    .map(item => ({
      recipient_type: 'Agent',
      agent: item.agent.email
        ? item.agent
        : {
            ...item.agent,
            email: item.email
          }
    }))
}
