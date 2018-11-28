import React from 'react'

import { Header } from '../components/PageHeader'
import Cards from './Cards'

export default class Store extends React.Component {
  render() {
    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Header
          title="Marketing Center"
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <Cards isSideMenuOpen={this.props.isSideMenuOpen} />
      </div>
    )
  }
}
