import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import LoadingContainer from 'components/LoadingContainer'

import { getDeals, searchDeals, getContextsByBrand } from 'actions/deals'
import {
  getActiveTeamId,
  hasUserAccess,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'
import { selectContextsByBrand } from 'reducers/deals/contexts'
import { IAppState } from 'reducers'

interface StateProps {
  user: IUser | null
  deals: Record<UUID, IDeal>
  brandContexts: IDealBrandContext[]
  isFetchingDeals: boolean
  brandId: UUID | null
}

interface Props {
  params: {
    id: UUID
  }
  children: React.ReactNode
}

const DealsContainer = (props: Props) => {
  console.log('[ x ] Rerender deals container')

  const dispatch = useDispatch()

  const { user, deals, brandContexts, isFetchingDeals, brandId } = useSelector<
    IAppState,
    StateProps
  >(({ deals, user }) => {
    const brandId = getActiveTeamId(user)

    return {
      deals: deals.list,
      brandContexts: selectContextsByBrand(deals.contexts, brandId),
      isFetchingDeals: deals.properties.isFetchingDeals,
      brandId,
      user
    }
  })

  useEffectOnce(() => {
    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!brandContexts) {
      dispatch(getContextsByBrand(brandId))
    }

    if (Object.keys(deals).length === 0 && !isFetchingDeals) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }
  })

  const isLoading = isFetchingDeals && props.params.id

  if (isLoading) {
    return (
      <LoadingContainer
        style={{
          height: 'calc(100vh - 6em)'
        }}
      />
    )
  }

  return props.children
}

export default DealsContainer
