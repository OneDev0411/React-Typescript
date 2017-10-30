import React from 'react'
import { connect } from 'react-redux'
import { getDeals } from '../../../../store_actions/deals'
import { hasUserAccess } from '../../../../utils/user-acl'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { getDeals, deals, forms, user } = this.props

    if (!deals) {
      getDeals(user, hasUserAccess(user, 'BackOffice'))
    }
  }

  render() {
    const { deals, user, error } = this.props
    const hasError = error && error.action === 'get-deals' && deals === null

    if (hasError) {
      return (
        <div className="deal-fetch-error">
          <i className="fa fa-exclamation-triangle fa-5x" />
          <p>{ error.message }</p>
        </div>
      )
    }

    return (
      <div className="deals">
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
  forms: deals.forms,
  user
}), { getDeals })(DealsContainer)
