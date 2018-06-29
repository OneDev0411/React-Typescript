import React from 'react'
import { connect } from 'react-redux'

import {
  getDeals,
  getAgents,
  getContexts,
  getForms
} from '../../../../store_actions/deals'
import { TrainingModeBanner } from '../Partials/TrainingModeBanner'
import { isTrainingAccount } from '../../../../utils/user-teams'

class DealsContainer extends React.Component {
  componentDidMount() {
    const {
      getDeals,
      getAgents,
      getContexts,
      getForms,
      contexts,
      forms,
      deals,
      agents,
      user
    } = this.props

    if (!deals) {
      getDeals(user)
    }

    if (!contexts) {
      getContexts()
    }

    if (!agents) {
      getAgents(user)
    }

    if (!forms) {
      getForms()
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
    error: deals.error,
    deals: deals.list,
    contexts: deals.contexts,
    agents: deals.agents,
    forms: deals.forms,
    user
  }),
  { getDeals, getAgents, getContexts, getForms }
)(DealsContainer)
