import React from 'react'
import { connect } from 'react-redux'
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

function DealsContainer(props) {
  useEffectOnce(() => {
    const { dispatch, user } = props

    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!props.brandContexts) {
      dispatch(getContextsByBrand(props.brandId))
    }

    if (Object.keys(props.deals).length === 0 && !props.isFetchingDeals) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }
  })

  const isLoading = props.isFetchingDeals && props.params.id

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

function mapStateToProps({ deals, user }) {
  const brandId = getActiveTeamId(user)

  return {
    error: deals.properties.error,
    deals: deals.list,
    brandContexts: selectBrandContexts(deals.contexts, brandId),
    isFetchingDeals: deals.properties.isFetchingDeals,
    brandId,
    user
  }
}

export default connect(mapStateToProps)(DealsContainer)
