import React from 'react'

import FactsheetsNav from 'deals/Dashboard/FactsheetsNav'

import { SideMenu, containerHeight } from '../styled'

export class FactsheetSideMenu extends React.Component {
  render() {
    if (!this.props.isFactsheetOpen) {
      return false
    }

    return (
      <SideMenu width="28rem" isOpen>
        <FactsheetsNav
          deal={this.props.deal}
          isBackOffice={this.props.isBackOffice}
          style={{
            height: containerHeight
          }}
        />
      </SideMenu>
    )
  }
}
