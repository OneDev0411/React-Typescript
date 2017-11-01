import React from 'react'
import { connect } from 'react-redux'
import { getDeals } from '../../../../store_actions/deals'
import { hasUserAccess } from '../../../../utils/user-acl'
import DealsError from './error'

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
  forms: deals.forms,
  user
}), { getDeals })(DealsContainer)
