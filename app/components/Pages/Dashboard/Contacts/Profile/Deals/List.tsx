import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { getActiveTeamId } from 'utils/user-teams'
import { sortDealsStatus } from 'utils/sort-deals-status'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { ShowMoreLess } from 'components/ShowMoreLess'

import { selectUser } from 'selectors/user'

import { DealItem } from './Item'

interface Props {
  contact: IContact
  deals: IDeal[]
}

export function List({ deals, contact }: Props) {
  const user = useSelector(selectUser)
  const statuses = useBrandStatuses(getActiveTeamId(user) || '')
  const sortedDealsByStatus = useMemo(() => sortDealsStatus(deals, statuses), [
    deals,
    statuses
  ])

  return (
    <ShowMoreLess
      count={3}
      moreText="Show more deals"
      textStyle={{ marginTop: '0.5em' }}
    >
      {sortedDealsByStatus.map(deal => (
        <DealItem key={deal.id} deal={deal} contact={contact} />
      ))}
    </ShowMoreLess>
  )
}
