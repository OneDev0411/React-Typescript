import React from 'react'
import S from 'shorti'
import DealDispatcher from '../../../../dispatcher/DealDispatcher'

export default class Deals extends React.Component {

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    // get deals
    this.getDeals(user)

    // get forms
    this.getForms(user)
  }

  getForms(user) {
    DealDispatcher.dispatch({
      action: 'get-deal-forms',
      user
    })
  }

  getDeals(user) {
    DealDispatcher.dispatch({
      action: 'get-deals',
      user
    })
  }

  render() {
    const { data } = this.props
    const user = data.user
    const deals = data.deals || {}
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { user, deals })
    )

    return (
      <div className="crm">
        <div className="deals">
          {
            !deals.list &&
            <div className="loading-list">
              <div><i className="fa fa-spinner fa-spin fa-2x fa-fw" /></div>
              <b>Loading deals ...</b>
            </div>
          }

          { deals.list && children }
        </div>
      </div>
    )
  }
}

Deals.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
