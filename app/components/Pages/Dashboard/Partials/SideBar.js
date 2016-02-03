// Dashboard.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown } from 'react-bootstrap'
import S from 'shorti'

// Partials
import ProfileImage from './ProfileImage'

export default class SideBar extends Component {
  render() {
    // Data
    const data = this.props.data
    const sidebar_height = window.innerHeight
    const sidebar_style = S('w-183 fixed pl-0 t-0 z-100 h-' + sidebar_height)
    const path = data.path

    const active = {}
    if (path === '/dashboard/recents')
      active.recents = 'active'

    if (path === '/dashboard/mls')
      active.mls = 'active'

    if (path === '/dashboard/contacts')
      active.contacts = 'active'

    if (path === '/dashboard/tasks')
      active.tasks = 'active'

    if (path.indexOf('/dashboard/transactions') !== -1)
      active.transactions = 'active'

    // User info
    const user = data.user
    const first_name = user.first_name
    const last_name = user.last_name

    return (
      <aside style={ sidebar_style } className="sidebar--dashboard pull-left bg-aqua">
        <div style={ S('mt-18') }>
          { /* <img src="/images/dashboard/icons/hamburger.svg"/> */ }
        </div>
        <Nav bsStyle="pills" stacked>
          <LinkContainer className={ active.recents } to="/dashboard/recents">
            <NavItem style={ S('w-78p') }>
              <img src={ active.recents ? '/images/dashboard/icons/sidenav/chat-active.svg' : '/images/dashboard/icons/sidenav/chat.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Conversations
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.mls } to="/dashboard/mls">
            <NavItem style={ S('w-75p') }>
              <img src={ active.mls ? '/images/dashboard/icons/sidenav/map-active.svg' : '/images/dashboard/icons/sidenav/map.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Search
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.contacts } to="/dashboard/contacts">
            <NavItem style={ S('w-75p') }>
              <img src={ active.contacts ? '/images/dashboard/icons/sidenav/people-active.svg' : '/images/dashboard/icons/sidenav/people.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;People
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.tasks } to="/dashboard/tasks">
            <NavItem style={ S('w-75p') }>
              <img src={ active.tasks ? '/images/dashboard/icons/sidenav/calendar-active.svg' : '/images/dashboard/icons/sidenav/calendar.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Calendar
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.transactions } to="/dashboard/transactions" onClick={ this.props.viewAllTransactions }>
            <NavItem style={ S('w-75p') }>
              <img src={ active.transactions ? '/images/dashboard/icons/sidenav/transactions-active.svg' : '/images/dashboard/icons/sidenav/transactions.svg' } style={ S('w-20 h-20') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Transactions
            </NavItem>
          </LinkContainer>
        </Nav>
        <div style={ S('absolute b-20 l-20') }>
          <Nav>
            <div style={ S('absolute z-0') }>
              <ProfileImage user={ user } />
            </div>
            <NavDropdown dropup id="main-nav-dropdown" className="main-nav-dropdown--account" eventKey={3} title={ first_name + ' ' + last_name }>
              <li><Link to="/account/settings"><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</Link></li>
              <li><Link to="/account/notifications"><i className="fa fa-envelope" style={ S('mr-15') }></i>Notifications</Link></li>
              <li role="separator" className="divider"></li>
              <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
            </NavDropdown>
          </Nav>
        </div>
      </aside>
    )
  }
}

// PropTypes
SideBar.propTypes = {
  data: React.PropTypes.object,
  viewAllTransactions: React.PropTypes.func
}