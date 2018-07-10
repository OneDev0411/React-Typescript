import React from 'react'
import { connect } from 'react-redux'

import {
  getDeals,
  getContexts,
  getForms
} from '../../../../store_actions/deals'
import { TrainingModeBanner } from '../Partials/TrainingModeBanner'
import { hasUserAccess, isTrainingAccount } from '../../../../utils/user-teams'

import DealsError from './error'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {
      getDeals,
      getContexts,
      getForms,
      contexts,
      forms,
      deals,
      user
    } = this.props

    if (!deals) {
      getDeals(user, hasUserAccess(user, 'BackOffice'))
    }

    if (!contexts) {
      getContexts()
    }

    if (!forms) {
      getForms()
    }
  }

  render() {
    const { deals, contexts, error, user } = this.props

    return (
      <div className="deals">
        {deals &&
          contexts &&
          isTrainingAccount(user) && <TrainingModeBanner user={user} />}

        <DealsError deals={deals} error={error} />

        {deals === null &&
          !error && (
            <div className="deal-fetch-loading">
              <i className="fa fa-spin fa-spinner fa-4x" />
              <p>Loading deals</p>
            </div>
          )}

        {deals && contexts && this.props.children}
      </div>
    )
  }
}

export default connect(
  ({ deals, user }) => ({
    error: deals.error,
    deals: deals.list,
    contexts: deals.contexts,
    forms: deals.forms,
    user
  }),
  { getDeals, getContexts, getForms }
)(DealsContainer)
