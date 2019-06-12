import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import LoadingContainer from 'components/LoadingContainer'

import { getDeals, searchDeals, getContexts } from 'actions/deals'
import {
  getActiveTeamId,
  hasUserAccess,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'

function DealsContainer(props) {
  useEffect(() => {
    const { dispatch, user } = props
    const brandId = getActiveTeamId(user)

    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!props.contexts[brandId]) {
      dispatch(getContexts(brandId))
    }

    if (Object.keys(props.deals).length === 0 && !props.isFetchingDeals) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }

    // eslint-disable-next-line
  }, [])

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

export default connect(({ deals, user }) => ({
  error: deals.properties.error,
  deals: deals.list,
  contexts: deals.contexts,
  isFetchingDeals: deals.properties.isFetchingDeals,
  user
}))(DealsContainer)
