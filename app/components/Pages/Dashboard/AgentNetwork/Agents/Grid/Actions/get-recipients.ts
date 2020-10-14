import { AggregatedAgentInfo } from '../../types'

export function getRecipients(
  agentsData: AggregatedAgentInfo[],
  selectedRows: UUID[]
): IDenormalizedEmailRecipientDealAgentInput[] {
  if (agentsData.length === 0 || selectedRows.length === 0) {
    return []
  }

  // Sometimes an agent can have a null id and email
  // in this cases we need to make sure filtering them out
  return agentsData
    .filter(
      item =>
        item.agent.id &&
        item.agent.email &&
        selectedRows.includes(item.agent.id)
    )
    .map(({ agent }) => ({
      recipient_type: 'Agent',
      agent
    }))
}
