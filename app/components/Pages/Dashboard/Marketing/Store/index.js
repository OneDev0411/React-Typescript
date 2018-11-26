import React from 'react'

import { Header } from './Header'
import Cards from './Cards'

export default class Store extends React.Component {
  render() {
    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Header
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <Cards isSideMenuOpen={this.props.isSideMenuOpen} />
      </div>
    )
  }
}
