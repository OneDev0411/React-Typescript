import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import Flex from 'styled-flex-component'
import { Helmet } from 'react-helmet'

import Spinner from 'components/Spinner'

import { getDeals, searchDeals, getContexts, getForms } from 'actions/deals'
import {
  getActiveTeamId,
  hasUserAccess,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'

class DealsContainer extends React.Component {
  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { props } = this
    const { dispatch, user } = props
    const brandId = getActiveTeamId(user)

    const isBackOffice = hasUserAccess(user, 'BackOffice')

    if (!hasUserAccess(user, 'Deals') && !isBackOffice) {
      browserHistory.push('/dashboard/mls')
    }

    if (!props.contexts[brandId]) {
      dispatch(getContexts(brandId))
    }

    if (_.size(props.deals) === 0 && !props.isFetchingDeals) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }

    if (!props.forms) {
      dispatch(getForms())
    }
  }

  isLoading = () => this.props.isFetchingDeals && this.props.params.id

  render() {
    if (this.isLoading()) {
      return (
        <Flex justifyCenter alignCenter style={{ height: '100vh' }}>
          <Spinner />
        </Flex>
      )
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Deals | Rechat</title>
        </Helmet>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default connect(({ deals, user }) => ({
  error: deals.properties.error,
  deals: deals.list,
  contexts: deals.contexts,
  forms: deals.forms,
  isFetchingDeals: deals.properties.isFetchingDeals,
  user
}))(DealsContainer)
