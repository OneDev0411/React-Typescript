import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {
  getDeals,
  getContexts,
  getForms
} from '../../../../store_actions/deals'
import { TrainingModeBanner } from '../Partials/TrainingModeBanner'
import { isTrainingAccount, hasUserAccess } from '../../../../utils/user-teams'

class DealsContainer extends React.Component {
  componentDidMount() {
    const { props } = this

    if (!hasUserAccess(props.user, 'Deals')) {
      browserHistory.push('/dashboard/mls')
    }

    if (!props.deals && !props.isFetchingDeals) {
      props.getDeals(props.user)
    }

    if (!props.contexts) {
      props.getContexts()
    }

    if (!props.forms) {
      props.getForms()
    }
  }

  render() {
    const { contexts, user } = this.props

    return (
      <div className="deals">
        {contexts &&
          isTrainingAccount(user) && <TrainingModeBanner user={user} />}

        {this.props.children}
      </div>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    error: deals.properties.error,
    deals: deals.list,
    contexts: deals.contexts,
    forms: deals.forms,
    isFetchingDeals: deals.properties.isFetchingDeals,
    user
  }),
  { getDeals, getContexts, getForms }
)(DealsContainer)
