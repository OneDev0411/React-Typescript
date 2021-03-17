import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { selectDealRoles } from 'reducers/deals/roles'

export function useDealRoles(
  deal: IDeal | null,
  paths?: string[]
): IDealRole[] {
  return useSelector<IAppState, IDealRole[]>(({ deals }) => {
    return deal
      ? (selectDealRoles(deals.roles, deal).filter((client: IDealRole) =>
          paths ? paths.includes(client.role) : true
        ) as IDealRole[])
      : []
  })
}
