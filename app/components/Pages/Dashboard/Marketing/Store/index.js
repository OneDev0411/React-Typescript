import React from 'react'

import { Header } from './Header'
import { Shortcuts } from './Shortcuts'

export default class Store extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <Shortcuts />
      </React.Fragment>
    )
  }
}
