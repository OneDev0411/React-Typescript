import React from 'react'

import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { IDealAgent } from 'deals/AgentNetwork/types'

import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import { getRecipients } from './get-recipients'

interface Props {
  deal: IDeal
  rows: IDealAgent[]
}

export function TableActions({ rows, deal }: Props) {
  const [state] = useGridContext()

  return (
    <SendDealPromotionCard
      deal={deal}
      recipients={getRecipients(rows, state.selection.selectedRowIds)}
      mediums="Email"
      buttonProps={{
        color: 'secondary',
        variant: 'contained'
      }}
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
