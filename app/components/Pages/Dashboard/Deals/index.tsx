import { ReactElement, memo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import LoadingContainer from 'components/LoadingContainer'

import { getDeals, searchDeals, getContextsByBrand } from 'actions/deals'
import {
  getActiveTeamId,
  hasUserAccess,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'
import { selectBrandContexts } from 'reducers/deals/contexts'
import { IAppState } from 'reducers'
import { useQueryParam } from '@app/hooks/use-query-param'

interface StateProps {
  user: IUser | null
  dealsCount: number
  brandContexts: IDealBrandContext[]
  isFetchingDeals: boolean
  brandId: UUID | null
}

interface Props {
  params: {
    id: UUID
  }
  children: ReactElement<any>
}

function Container(props: Props) {
  console.log('[ x ] Rerender deals container')

  const dispatch = useDispatch()
  const [queryParamValue] = useQueryParam('q')

  const { user, dealsCount, brandContexts, isFetchingDeals, brandId } =
    useSelector<IAppState, StateProps>(({ deals, user }) => {
      const brandId = getActiveTeamId(user)

      return {
        dealsCount: Object.keys(deals.list).length,
        brandContexts: selectBrandContexts(deals.contexts, brandId),
        isFetchingDeals: deals.properties.isFetchingDeals,
        brandId,
        user
      }
    }, shallowEqual)

  useEffectOnce(() => {
    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!brandContexts) {
      dispatch(getContextsByBrand(brandId))
    }

    if (dealsCount === 0 && !isFetchingDeals) {
      if ((isBackOffice || viewAsEveryoneOnTeam(user)) && !queryParamValue) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user, queryParamValue))
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

  return <>{props.children}</>
}

export default memo(Container)
