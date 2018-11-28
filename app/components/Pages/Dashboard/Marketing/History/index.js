import React from 'react'

import { Header } from '../components/PageHeader'
import { ZeroState } from './ZeroState'

export default class History extends React.Component {
  render() {
    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Header
          title="All My Designs"
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        <ZeroState />
      </div>
    )
  }
}
