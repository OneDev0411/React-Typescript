import React from 'react'

import { SideMenu } from '../styled'
import FactsheetsNav from '../../Dashboard/FactsheetsNav'

export class FactsheetSideMenu extends React.Component {
  render() {
    if (!this.props.isFactsheetOpen) {
      return false
    }

    return (
      <SideMenu width="21rem" isOpen>
        <FactsheetsNav
          deal={this.props.deal}
          isBackOffice={this.props.isBackOffice}
        />
      </SideMenu>
    )
  }
}
