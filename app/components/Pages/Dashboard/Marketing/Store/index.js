import React from 'react'

import { Callout } from 'components/Callout'

import { Header } from '../components/PageHeader'
import Cards from './Cards'

export default class Store extends React.Component {
  render() {
    return (
      <div style={{ padding: '0 1.5rem', background: '#fff' }}>
        <Header
          title="All Designs"
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />

        <Callout type="error">
          <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 500 }}>
            We are currently working on this feature, we will notify you shortly
            when our work completes.
          </span>
        </Callout>

        <Cards isSideMenuOpen={this.props.isSideMenuOpen} />
      </div>
    )
  }
}
