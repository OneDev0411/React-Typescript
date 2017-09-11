import React from 'react'
import { connect } from 'react-redux'
import { getDeals } from '../../../../store_actions/deals'

class DealsContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, deals, forms, user } = this.props

    if (!deals) {
      const isBackOffice = user.features.indexOf('Backoffice') > -1 ? true : false
      dispatch(getDeals(user, isBackOffice))
    }
  }

  render() {
    const { deals, user } = this.props
    const children = React.cloneElement(this.props.children, { user, deals })

    return (
      <div className="deals">
        {
          deals === null &&
          <div
            style={{ textAlign: 'center', padding: '30% 0' }}
          >
            <img
              style={{ width: '64px' }}
              src="/static/images/deals/pacman.svg"
            />
            <p><b>Loading deals</b></p>
          </div>
        }

        { deals && children }
      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  deals: deals.list,
  forms: deals.forms,
  user: data.user
}))(DealsContainer)
