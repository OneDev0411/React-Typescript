import React from 'react'

import { StateContext } from 'components/Grid/Table/context'
import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { IDealAgent } from 'deals/AgentNetwork/types'

import { getRecipients } from './get-recipients'

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
