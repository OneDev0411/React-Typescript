import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import AppStore from '../../../../../stores/AppStore'
import SideBar from '../../Partials/SideBar'
import MobileNav from '../../Partials/MobileNav'

export default class Deals extends Component {

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    if (!user)
      return

    AppStore.data.user = user
    AppStore.emitChange()

    this.checkForMobile()
    this.getDeals(user)
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  getDeals(user) {
    ConciergeDispatcher.dispatch({
      action: 'get-deals',
      user
    })
  }

  getDealAddress(deal) {
    if (deal.context && deal.context.street_name)
      return deal.context.street_name
    else if (deal.proposed_values && deal.proposed_values.street_name)
      return deal.proposed_values.street_name

    return '-'
  }

  getDealSide(deal) {
    if (deal.context && deal.context.deal_type)
      return deal.context.deal_type
    else if (deal.proposed_values && deal.proposed_values.deal_type)
      return deal.proposed_values.deal_type

    return '-'
  }

  getListingImage(deal) {
    if (!deal.listing)
      return <span></span>

    return (
      <img
        src={ deal.listing.cover_image_url }
        className="preview-file"
      />
    )
  }

  render() {
    const { data } = this.props
    const user = data.user

    let main_style = S('absolute l-70 r-0')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('l-0 w-100p') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    return (
      <div style={ S('minw-1000') }>
        <main>
          { nav_area }
          <div className="deals" style={ main_style }>
            {
              data.concierge_deals &&
              <div>
                <h3>Deals</h3>
                <table>
                  <thead>
                    <tr>
                      <td>ADDRESS</td>
                      <td>AGENT NAME</td>
                      <td>SIDE</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.concierge_deals.map(deal => {
                        return (
                          <tr key={`DEAL_${deal.id}`}>
                            <td>
                              <Link to={`/dashboard/concierge/deals/${deal.id}`}>
                                { this.getListingImage(deal) }
                                { this.getDealAddress(deal) }
                              </Link>
                            </td>
                            <td>{ deal.created_by.display_name }</td>
                            <td>{ this.getDealSide(deal) }</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            }

            {
              !data.concierge_deals &&
              <div>Loading deals ...</div>
            }
          </div>
        </main>
      </div>
    )
  }
}

Deals.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object
}
