import React from 'react'

import { StateContext } from 'components/Grid/Table/context'
import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { IDealAgent } from 'deals/AgentNetwork/types'

interface Props {
  state: StateContext
  deal: IDeal
  rows: IDealAgent[]
}

export function TableActions({ state, rows, deal }: Props) {
  return (
    <SendDealPromotionCard
      deal={deal}
      recipients={getRecipients(rows, state.selection.selectedRowIds)}
      mediums="Email"
      types={[
        'OpenHouse',
        'JustSold',
        'ComingSoon',
        'JustListed',
        'PriceImprovement'
      ]}
    >
      Promote Listing
    </SendDealPromotionCard>
  )
}

const getRecipients = (
  data: IDealAgent[],
  selectedRows: UUID[]
): IDenormalizedEmailRecipientDealAgentInput[] => {
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
        item.agentId &&
        item.agent &&
        item.agent.email &&
        selectedRows.includes(item.id) &&
        item.email
    )
    .map(item => ({
      recipient_type: 'Agent',
      agent: item.agent
    }))
}
