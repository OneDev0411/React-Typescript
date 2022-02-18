import { ReactElement, memo } from 'react'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { useQueryParam } from '@app/hooks/use-query-param'
import { getDeals, searchDeals, getContextsByBrand } from 'actions/deals'
import LoadingContainer from 'components/LoadingContainer'
import { IAppState } from 'reducers'
import { selectBrandContexts } from 'reducers/deals/contexts'
import { hasUserAccessToDeals, isBackOffice } from 'utils/acl'
import { viewAsEveryoneOnTeam } from 'utils/user-teams'

import { DealContextProviders } from './contexts'

interface StateProps {
  activeTeam: Nullable<IUserTeam>
  dealsCount: number
  brandContexts: IDealBrandContext[]
  isFetchingDeals: boolean
  brandId: Nullable<UUID>
}

interface Props {
  params: {
    id: UUID
  }
  children: ReactElement<any>
}
function Container(props: Props) {
  const dispatch = useDispatch()
  const [queryParamValue] = useQueryParam('q')

  const {
    activeTeam = null,
    dealsCount,
    brandContexts,
    isFetchingDeals,
    brandId
  } = useSelector<IAppState, StateProps>(({ deals, user, activeTeam }) => {
    const brandId = activeTeam?.brand.id ?? null

    return {
      dealsCount: Object.keys(deals.list).length,
      brandContexts: selectBrandContexts(deals.contexts, brandId),
      isFetchingDeals: deals.properties.isFetchingDeals,
      activeTeam,
      brandId,
      user
    }
  }, shallowEqual)

  useEffectOnce(() => {
    const hasBackOfficeAccess = isBackOffice(activeTeam)

    if (!hasUserAccessToDeals(activeTeam) && !hasBackOfficeAccess) {
      browserHistory.push('/dashboard/mls')
    }

    if (!brandContexts) {
      dispatch(getContextsByBrand(brandId))
    }

    if (dealsCount === 0 && !isFetchingDeals) {
      if (
        (hasBackOfficeAccess || viewAsEveryoneOnTeam(activeTeam)) &&
        !queryParamValue
      ) {
        dispatch(getDeals(activeTeam))
      } else {
        dispatch(
          queryParamValue
            ? searchDeals(activeTeam, queryParamValue)
            : getDeals(activeTeam)
        )
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

  return <DealContextProviders>{props.children}</DealContextProviders>
}

export default memo(Container)
