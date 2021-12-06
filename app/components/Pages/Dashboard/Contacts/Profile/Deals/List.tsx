import React, { useMemo } from 'react'

import { useTheme, Theme } from '@material-ui/core'

import { ShowMoreLess } from 'components/ShowMoreLess'
import { useUnsafeActiveTeamId } from 'hooks/team/use-unsafe-active-team-id'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import { sortDealsStatus } from 'utils/sort-deals-status'

import { DealItem } from './Item'

interface Props {
  contact: IContact
  deals: IDeal[]
}

export function List({ deals, contact }: Props) {
  const theme: Theme = useTheme()
  const activeTeamId = useUnsafeActiveTeamId()
  const [statuses] = useBrandStatuses(activeTeamId || '')
  const sortedDealsByStatus = useMemo(
    () => sortDealsStatus(deals, statuses),
    [deals, statuses]
  )

  return (
    <ShowMoreLess
      count={3}
      moreText="Show more deals"
      textStyle={{
        padding: theme.spacing(1),
        color: theme.palette.grey[700],
        justifyContent: 'space-between',
        ...theme.typography.body2
      }}
    >
      {sortedDealsByStatus.map(deal => (
        <DealItem key={deal.id} deal={deal} contact={contact} />
      ))}
    </ShowMoreLess>
  )
}
