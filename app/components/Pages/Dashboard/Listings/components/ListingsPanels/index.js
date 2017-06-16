import S from 'shorti'
import React, { Component } from 'react'

import GridView from './GridView'
import PanelsSwitch from './PanelsSwitch'

export default class ListingPanel extends Component {
  render() {
    const { data, listings, activePanel, tabName } = this.props
    const user = data.user

    // Listing panel
    let heading_height = 150
    let panel_top = 80
    let panel_width = 320

    const listing_panel_wrap_style = S('fixed t-55 r-0 w-0 h-0 z-5')
    let listing_panel_style_shorti = S(
      `absolute t-0 w-${panel_width} bg-fff h-${window.innerHeight}`
    )
    let listing_panel_style = {
      ...listing_panel_style_shorti,
      borderLeft: '1px solid rgb(204, 204, 204)'
    }
    // Go full (width) monty
    // if (data.listing_panel && data.listing_panel.size === 'full') {
    //   const panel_width = data.user ? (window.innerWidth - 70) : window.innerWidth
    //   listing_panel_style = {
    //     ...listing_panel_style,
    //     ...S(`w-${panel_width}`)
    //   }
    //   listing_scroll_style = {
    //     ...listing_scroll_style,
    //     ...S(`w-${panel_width}`)
    //   }
    // }
    let panel_class = 'listing-panel'
    let button_class = 'listing-panel__button invisible'
    const listing_panel_icon = <span className="close">&times;</span>
    // if (data.show_listing_panel) {
    panel_class += ' active'
    button_class = 'listing-panel__button'
    // }

    return (
      <div>
        <PanelsSwitch activePanel={activePanel} tabName={tabName} />
        <div style={listing_panel_wrap_style}>
          <div style={listing_panel_style} className={panel_class}>
            <div>
              <div style={S('pt-10 pl-15 pr-15 mb-10')}>
                <div className="sf" style={S('color-444 font-24')}>
                  <span style={S('fw-600')}>{listings.data.length}</span>
                  {` of ${listings.info.total} Homes`}
                </div>
              </div>
            </div>
            {activePanel === 'map' && <GridView {...this.props} />}
          </div>
        </div>
      </div>
    )
  }
}
