import React, { Component } from 'react'
import S from 'shorti'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import ConciergeDispatcher from '../../../../../dispatcher/ConciergeDispatcher'
import AppStore from '../../../../../stores/AppStore'
import SideBar from '../../Partials/SideBar'
import MobileNav from '../../Partials/MobileNav'
import { addressTitle } from '../../../../../utils/listing'

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
    return deal.listing ? addressTitle(deal.listing.property.address) : deal.address
  }

  getListingImage(deal) {
    if (!deal.listing)
      return <span></span>

    return (
      <img
        src={ deal.listing.cover_image_url }
        style={{ width: '35px', height: '35px', borderRadius: '3px', marginRight: '2%' }}
      />
    )
  }

  render() {
    const { data } = this.props
    const user = data.user

    let main_style = S('absolute h-100p l-70 r-0')
    let nav_area = <SideBar data={ data } />

    if (data.is_mobile) {
      main_style = { ...main_style, ...S('l-0 w-100p') }

      if (user)
        nav_area = <MobileNav data={ data } />
    }

    console.log(AppStore.data)
    return (
      <div style={ S('minw-1000') }>
        <main>
          { nav_area }
          <div className="deals" style={ main_style }>
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
                  AppStore.data.concierge_deals &&
                  AppStore.data.concierge_deals.map(deal => {
                    return (
                      <tr key={`DEAL_${deal.id}`}>
                        <td>
                          { this.getListingImage(deal) }
                          { this.getDealAddress(deal) }
                        </td>
                        <td>{ deal.created_by.display_name }</td>
                        <td>{ deal.deal_type }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
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
