import React from 'react'
import S from 'shorti'
import ConciergeDispatcher from '../../../../dispatcher/ConciergeDispatcher'

export default class Concierge extends React.Component {

  componentDidMount() {
    const getDealsAction = {
      user: this.props.data.user,
      type: 'GET_DEALS'
    }
    ConciergeDispatcher.dispatch(getDealsAction)
  }

  render() {
    const { user, conciergeDeals } = this.props.data

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        user,
        conciergeDeals
      })
    )

    return (
      <div className="crm">
        <div className="deals">
          {
            !conciergeDeals &&
            <div className="loading-list">
              <div><i className="fa fa-spinner fa-spin fa-2x fa-fw" /></div>
              <b>Loading Deals ...</b>
            </div>
          }

          { conciergeDeals && children }
        </div>
      </div>
    )
  }
}