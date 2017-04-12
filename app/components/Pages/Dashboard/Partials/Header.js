// Header.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import helpers from '../../../../utils/helpers'

export default class Header extends Component {

  render() {
    const data = this.props.data
    const user = data.user
    const path = data.path
    let title
    let subtitle
    let nav_tabs
    // Recents
    if (path === '/dashboard/recents') {
      title = (
        <h2 style={S('font-22 mt-20')}>Conversations</h2>
      )
    }
    // MLS
    if (path === '/dashboard/mls') {
      title = (
        <h2 style={S('font-22 mt-20')}>Search</h2>
      )
    }

    // Style
    let nav_bar_style = { ...S('mb-0 p-0 pt-3 relative'), borderBottom: '1px solid #e7e4e3' }
    nav_bar_style = { ...nav_bar_style, ...S('h-70') }

    return (
      <header style={S('pl-70')}>
        <div style={nav_bar_style} fluid>
          <div>
            <div style={S('pl-15 w-100p')}>
              { title }
              { subtitle }
            </div>
          </div>
          { nav_tabs }
        </div>
      </header>
    )
  }
}

// PropTypes
Header.propTypes = {
  data: React.PropTypes.object,
  viewTransaction: React.PropTypes.func,
  removeTransactionTab: React.PropTypes.func,
  viewContact: React.PropTypes.func,
  removeContactTab: React.PropTypes.func
}
