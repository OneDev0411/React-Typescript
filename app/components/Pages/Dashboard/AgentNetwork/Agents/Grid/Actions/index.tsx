import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import { getRecipients } from './get-recipients'
import { AggregatedAgentInfo, ListingWithProposedAgent } from '../../types'

const MEDIUMS: IMarketingTemplateMedium[] = ['Email']
const TEMPLATE_TYPES: IMarketingTemplateType[] = [
  'OpenHouse',
  'JustSold',
  'ComingSoon',
  'JustListed',
  'PriceImprovement'
]

interface Props {
  listing: Nullable<ListingWithProposedAgent>
  agents: Nullable<AggregatedAgentInfo[]>
}

export function TableActions({ listing, agents }: Props) {
  const [state] = useGridContext()
  const [isMarketingClicked, setIsMarketingClicked] = useState<Nullable<true>>(
    null
  )

  console.log({ agents, state })

  return (
    <>
      <SendMlsListingCard
        hasExternalTrigger
        isTriggered={isMarketingClicked}
        isTemplatesColumnHiddenDefault={false}
        listing={listing}
        mediums={MEDIUMS}
        types={TEMPLATE_TYPES}
      />
      <Button variant="outlined" onClick={() => setIsMarketingClicked(true)}>
        Promote Listing
      </Button>
    </>
  )
}
