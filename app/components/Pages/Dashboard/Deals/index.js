import React from 'react'
import { connect } from 'react-redux'
import { getDeals, getAgents, getContexts } from '../../../../store_actions/deals'
import { hasUserAccess } from '../../../../utils/user-teams'
import DealsError from './error'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {
      getDeals,
      getAgents,
      getContexts,
      contexts,
      deals,
      agents,
      forms,
      user
    } = this.props

    if (!deals) {
      getDeals(user, hasUserAccess(user, 'BackOffice'))
    }

    if (!contexts) {
      getContexts()
    }

    if (!agents) {
      getAgents(user)
    }
  }

  render() {
    const { deals, contexts, error } = this.props

    return (
      <div className="deals">
        <DealsError deals={deals} error={error} />

        {deals === null && (
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
    agents: deals.agents,
    forms: deals.forms,
    user
  }),
  { getDeals, getAgents, getContexts }
)(DealsContainer)
