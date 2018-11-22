import React from 'react'

import { Header } from './Header'

export default class Store extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Header
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <div>Store</div>
      </React.Fragment>
    )
  }
}
