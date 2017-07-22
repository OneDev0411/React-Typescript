import React from 'react'
import { connect } from 'react-redux'
import { getDeals, getForms } from '../../../../store_actions/deals'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getDeals(user))
  }

  componentDidMount() {
    const { dispatch, deals, forms } = this.props

    if (!deals) {
      dispatch(getDeals())
    }

    if (!forms) {
      dispatch(getForms())
    }
  }

  render() {
    const { deals, user } = this.props
    const children = React.cloneElement(this.props.children, { user, deals })

    if (!deals) {
      return false
    }

    return (
      <div className="deals">
        { children }
      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  deals: deals.list,
  forms: deals.forms,
  user: data.user
}))(DealsContainer)
