import React from 'react'
import { connect } from 'react-redux'
import { getDeals, getAgents } from '../../../../store_actions/deals'
import { hasUserAccess } from '../../../../utils/user-acl'
import DealsError from './error'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { getDeals, getAgents, deals, agents, forms, user } = this.props

    if (!deals) {
      getDeals(user, hasUserAccess(user, 'BackOffice'))
    }

    if (!agents) {
      getAgents(user)
    }
  }

  render() {
    const { deals, user, error } = this.props

    return (
      <div className="deals">
        <DealsError
          deals={deals}
          error={error}
        />

        {
          deals === null &&
          <div className="deal-fetch-loading">
            <i className="fa fa-spin fa-spinner fa-4x" />
            <p>Loading deals</p>
          </div>
        }

        { deals && this.props.children }
      </div>
    )
  }
}

export default connect(({ deals, user }) => ({
  error: deals.error,
  deals: deals.list,
  agents: deals.agents,
  forms: deals.forms,
  user
}), { getDeals, getAgents })(DealsContainer)
