import React from 'react'
import S from 'shorti'
import moment from 'moment'
import DealDispatcher from '../../../../dispatcher/DealDispatcher'

export default class Deals extends React.Component {

  constructor(props) {
    super(props)
    this.reloadTimer = null
  }

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    // get deals
    this.getDeals(user)

    // get forms
    this.getForms(user)

    // create reload timer
    this.reloadTimer =
      window.setInterval(this.reloadDeals.bind(this), 60 * 2 * 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.reloadTimer)
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

  reloadDeals() {
    const { user, deals } = this.props.data

    if (moment().isAfter(deals.expire_at))
      this.getDeals(user)
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
